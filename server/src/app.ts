import express, { Request, Response } from "express";
import path from "path";
import mqtt from "mqtt";
import { pool } from "./db";
import * as dbUtility  from "./dbUtility";
import * as forecasting from "./forecasting";
const app = express();
const publicPath = path.join(__dirname, "../public");

// DB UTil
type dbResponse =  [{id: number, module_id: number, current: string, voltage: string, power: string, timestamp: string}]
const intervals = [
  "minutes",
  "hours",
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;

type Interval = typeof intervals[number];

const handlers : Record<Interval, () => Promise<dbResponse[]>>= {
  minutes: dbUtility.readMinutesData,
  hours: dbUtility.readHoursData,
  daily: dbUtility.readDailyData,
  weekly: dbUtility.readWeeklyData,
  monthly: dbUtility.readMonthlyData,
  yearly: dbUtility.readYearlyData,
};

//MQTT Client Setup
const MQTT_URL = process.env.MQTT_URL ?? "mqtt://localhost:1883";
const TELEMETRY_TOPIC = process.env.MQTT_TELEMETRY_TOPIC ?? "telemetry/#";



type MinutePayload = {
  device: string;
  module: number;
  ts: number;
  relay: number;
  current: number;
  voltage: number;
  power: number; 
};


const SUB_TOPICS = [
  "tele/+/module/+/minute",
  "stat/+/module/+/relay",
  "stat/+/online",
];


function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}
function parseTeleMinuteTopic(
  topic: string
): { device: string; moduleId: number } | null {
  // tele/esp32-1/module/1/minute
  const m = topic.match(/^tele\/([^/]+)\/module\/(\d+)\/minute$/);

  if (!m || !m[1] || !m[2]) return null;

  return {
    device: m[1],          
    moduleId: Number(m[2])
  };
}
function parseRelayTopic(
  topic: string
): { device: string; moduleId: number } | null {
  // stat/esp32-1/module/1/relay
  const m = topic.match(/^stat\/([^/]+)\/module\/(\d+)\/relay$/);

  if (!m || !m[1] || !m[2]) return null;

  return {
    device: m[1],
    moduleId: Number(m[2])
  };
}
const client = mqtt.connect(MQTT_URL);

export function startMqttIngest() {

  client.on("connect", () => {
    console.log("[MQTT] connected:", MQTT_URL);
    client.subscribe(SUB_TOPICS, (err) => {
      if (err) console.error("[MQTT] subscribe error:", err);
      else console.log("[MQTT] subscribed:", SUB_TOPICS.join(", "));
    });
  });

  client.on("error", (err) => console.error("[MQTT] error:", err));

  client.on("message", async (topic, buf) => {
    const msg = buf.toString("utf8");
    const teleInfo = parseTeleMinuteTopic(topic);
    if (teleInfo) {
      let data: MinutePayload;
      try {
        data = JSON.parse(msg);
      } catch {
        console.warn("[MQTT] bad JSON on", topic, msg.slice(0, 200));
        return;
      }

      const moduleId = teleInfo.moduleId;
      const current = Number(data.current);
      const voltage = Number(data.voltage);

      if (!Number.isFinite(current) || !Number.isFinite(voltage)) {
        console.warn("[MQTT] invalid numbers on", topic, { current: data.current, voltage: data.voltage });
        return;
      }
      const power = Number.isFinite(Number(data.power)) ? Number(data.power) : current * voltage;

      try {
        const result = await dbUtility.writeMinutesData(moduleId, current, voltage, power);
        console.log("[DB] inserted minute:", teleInfo.device, moduleId, power, result);
      } catch (e) {
        console.error("[DB] insert failed:", e);
      }
      return;
    }

    const relayInfo = parseRelayTopic(topic);
    if (relayInfo) {
      const state = msg.trim(); // "OFF" / "ON"
      //console.log(`[MQTT] relay state ${relayInfo.device} module ${relayInfo.moduleId}: ${state}`);

      const result = await dbUtility.setModuleStatus(relayInfo.moduleId, state === "ON");
      //console.log("[DB] set module status:", relayInfo.device, relayInfo.moduleId, state === "ON", result);
      return;
    }

    if (/^stat\/[^/]+\/online$/.test(topic)) {
      //console.log("[MQTT] device presence:", topic, msg.trim());
      return;
    }

  });

  return client;
}

startMqttIngest();

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());    

function isInterval(x: unknown): x is Interval {
  return typeof x === "string" && (intervals as readonly string[]).includes(x);
}
app.get("/api/last/hours", async (req: Request, res: Response) => {  
  const data = await dbUtility.getTodayHourlyData();
  res.json(data);
});

app.get("/api/last/yesterday", async (req: Request, res: Response) => {  
  const data = await dbUtility.getYesterdayDailyData();
  res.json(data);
});

app.get("/api/last/weeks", async (req: Request, res: Response) => {  
  const data = await dbUtility.getThisWeekData();
  res.json(data);
});

app.get("/api/weeksByHour", async (req: Request, res: Response) => {  
  const data = await dbUtility.getThisWeekHourlyData();
  res.json(data);
});

app.get("/api/monthsByHour", async (req: Request, res: Response) => {  
  const data = await dbUtility.getThisMonthHourlyData();
  res.json(data);
});
 
app.get("/api/last/months", async (req: Request, res: Response) => {  
  const data = await dbUtility.getLastMonthData();
  res.json(data);
});

app.get("/api/modules", async (req: Request, res: Response) => {
  const data = await dbUtility.readModulesData();
  res.json(data);
})

app.get("/api/module/:moduleID", async (req: Request, res: Response) => {  
  const moduleID = req.params.moduleID as string;
  if (!moduleID) return;

  const data = await dbUtility.getLastUploadedMinuteData(moduleID);
  res.json(data);
});

app.get("/api/history", async (req: Request, res: Response) => {
  try {
    const data = await dbUtility.getDashboardFrontendData();
    res.json(data);
  } catch (err) {
    console.error("GET /api/dashboard failed:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

app.get("/api/forecasting/:name", async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const moduleId = req.query.moduleId ? Number(req.query.moduleId) : undefined;
    const hasModuleId = Number.isFinite(moduleId);

    const takeN = <T,>(arr: T[], n: number) => arr.slice(0, n);

    // Build an object: { [moduleId]: points[] } and slice during build
    const buildByModule = async <T,>(
      fn: (mid: number) => Promise<T[]>,
      n: number
    ): Promise<Record<number, T[]>> => {
      const moduleIds = await dbUtility.getModuleIds();
      const out: Record<number, T[]> = {};
      for (const mid of moduleIds) {
        const rows = await fn(mid);
        out[mid] = takeN(rows, n);
      }
      return out;
    };

  if (name === "hours24") {
  const [actual, forecast] = await Promise.all([
    dbUtility.getActualHours24_AllModules(),
    dbUtility.getForecastHours24_AllModules(),
  ]);

  return res.json({ actual, forecast, splitIndex: actual.length });
}

if (name === "days7") {
  const [actual, forecast] = await Promise.all([
    dbUtility.getActualDays7_AllModules(),
    dbUtility.getForecastDays7_AllModules(),
  ]);

  return res.json({ actual, forecast, splitIndex: actual.length });
}

if (name === "days30") {
  const [actual, forecast] = await Promise.all([
    dbUtility.getActualDays30_AllModules(),
    dbUtility.getForecastDays30_AllModules(),
  ]);

  return res.json({ actual, forecast, splitIndex: actual.length });
}
    if (name === "monthTotals") {
      if (hasModuleId) {
        const totals = await dbUtility.getThisMonthTotals(moduleId as number);
        return res.json({ moduleId, ...totals });
      }

      const moduleIds = await dbUtility.getModuleIds();
      const totalsByModule: Record<number, Awaited<ReturnType<typeof dbUtility.getThisMonthTotals>>> = {};

      let sumActual = 0;
      let sumForecastRemaining = 0;
      let sumFull = 0;

      for (const mid of moduleIds) {
        const t = await dbUtility.getThisMonthTotals(mid);
        totalsByModule[mid] = t;
        sumActual += t.actualThisMonth;
        sumForecastRemaining += t.forecastRemainingThisMonth;
        sumFull += t.forecastFullMonthEstimate;
      }

      return res.json({
        totalsByModule,
        totalsAllModules: {
          actualThisMonth: sumActual,
          forecastRemainingThisMonth: sumForecastRemaining,
          forecastFullMonthEstimate: sumFull,
        },
      });
    }

    return res.status(400).json({
      error: "Invalid name. Use: hours24 | days7 | days30 | monthTotals",
    });
  } catch (err) {
    console.error("GET /api/forecasting/:name failed:", err);
    return res.status(500).json({ error: "Failed to load forecasting data" });
  }
});


app.get("/api/:params", async (req: Request, res: Response) => {
  const interval = req.params.params;

  if (!isInterval(interval)) {
    return res.status(404).json({ error: "Invalid interval" });
  }

  const handler = handlers[interval];

  try {
    const data = await handler();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


// SCHEDULED PROCESSES
forecasting.doRollups();
forecasting.startPredictionScheduler();
dbUtility.fillMissingMinutesWithZeros();

// FORECASTING APIS
app.get("/api/forecastedData/minutes", async (req: Request, res: Response) => {
  dbUtility.getForecastedMinutes().then(data => res.json(data));
})

// dbUtility.getLast300Minutes(1).then(data => {
//   let newData = data.map(x => parseFloat(x.current));
//   forecasting.runForecastProcess("hourly", newData).then(data => {
//     console.log(data.data);
//   })
// })

app.get("/api/forecastedData/hours", async (req: Request, res: Response) => {
  dbUtility.getForecastedHours().then(data => res.json(data));
})

app.get("/api/forecastedData/days", async (req: Request, res: Response) => {
  dbUtility.getForecastedDays().then(data => res.json(data));
})

app.get("/api/forecastedData/weeks", async (req: Request, res: Response) => {
  dbUtility.getForecastedWeeks().then(data => res.json(data));
})

app.get("/api/forecastedData/months", async (req: Request, res: Response) => {
  dbUtility.getForecastedMonths().then(data => res.json(data));
})

app.get("/api/forecastedData/years", async (req: Request, res: Response) => {
  dbUtility.getForecastedYears().then(data => res.json(data));
})

// HANDLE SWITCHING RELAYS API
app.get("/api/switching/:moduleId/status", async (req: Request, res: Response) => {
  const module_id = req.params.moduleId as string;
  dbUtility.getModuleStatus(parseInt(module_id)).then(data => {
    res.json(data)
  })
})
app.get("/api/switching/:moduleId/on", async (req: Request, res: Response) => {
  const module_id = parseInt(req.params.moduleId as string);

  const topic = `cmnd/esp32-1/module/${module_id}/relay`;

  const ok = client.publish(topic, "ON");

  await new Promise(r => setTimeout(r, 300));

  const result = await dbUtility.setModuleStatus(module_id, true);

  res.json({ status: "sent ON", topic, result });
})

app.get("/api/switching/:moduleId/off", async (req: Request, res: Response) => {
  const moduleId = parseInt(req.params.moduleId as string);

  const topic = `cmnd/esp32-1/module/${moduleId}/relay`;

  const ok = client.publish(topic, "OFF");

  if (!ok) {
    return res.status(500).json({ error: "MQTT publish failed" });
  }

  await new Promise(r => setTimeout(r, 300));

  const result = await dbUtility.setModuleStatus(moduleId, false);

  res.json({ status: "sent OFF", topic, result });
})

app.get("/api/dashboard/modules", async (_req, res) => {
  try {
    const data = await dbUtility.getDashboardModules();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard modules" });
  }
});



// HANDLE NAMING API
app.get("/api/naming/:moduleId/name", async (req: Request, res: Response) => {
  const module_id = req.params.moduleId as string;
  dbUtility.getModuleName(parseInt(module_id)).then(data => {
    res.json(data)
  })
})

app.get("/api/naming/:moduleId/set/:name", async (req: Request, res: Response) => {
  const module_id = req.params.moduleId as string;
  const newName = req.params.name as string;
  const result = await dbUtility.setModuleName(parseInt(module_id), newName);
  res.json({ success: result });
})


// SERVE TESTING FILES

// SERVE CLIENT WITH DASHBOARD
app.use((_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

console.log("App initialized");
export default app;