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

// END

app.use((_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

console.log("App initialized");
export default app;