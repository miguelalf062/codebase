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
const client = mqtt.connect("mqtt://broker.hivemq.com"); // public broker for testing

client.on("connect", () => {
  console.log("✅ MQTT connected");

  // Subscribe to all module data topics
  client.subscribe("home/+/data", (err) => {
    if (err) console.error("Subscription error:", err);
    else console.log("Subscribed to home/+/data topics");
  });
});
// Listen for incoming messages
client.on("message", async (topic : string, message) => {
  try {
    const parts = topic.split("/");

    if (!parts[1]) {
      console.error("Invalid topic format:", topic);
      return;
    }

    const moduleIdStr = parts[1].replace("module", "");
    const module_id = parseInt(moduleIdStr);

    if (isNaN(module_id)) {
      console.error("Invalid module id:", moduleIdStr);
      return;
    }

    const payload = JSON.parse(message.toString());
  
  } catch (err) {
    console.error("Error handling MQTT message:", err);
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());    

// get db
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
  const module_id = req.params.moduleId as string;

  // set Device on in esp32 then set module status to on if successful

  dbUtility.setModuleStatus(parseInt(module_id), true)
})

app.get("/api/switching/:moduleId/off", async (req: Request, res: Response) => {
  const module_id = req.params.moduleId as string;

  // set Device on in esp32 then set module status to off if successful

  dbUtility.setModuleStatus(parseInt(module_id), false)
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
  dbUtility.setModuleName(parseInt(module_id), newName);
})


// SERVE TESTING FILES

// SERVE CLIENT WITH DASHBOARD
app.use((_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

console.log("App initialized");
export default app;