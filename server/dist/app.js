"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mqtt_1 = __importDefault(require("mqtt"));
const dbUtility = __importStar(require("./dbUtility"));
const forecasting = __importStar(require("./forecasting"));
const app = (0, express_1.default)();
const publicPath = path_1.default.join(__dirname, "../public");
const intervals = [
    "minutes",
    "hours",
    "daily",
    "weekly",
    "monthly",
    "yearly",
];
const handlers = {
    minutes: dbUtility.readMinutesData,
    hours: dbUtility.readHoursData,
    daily: dbUtility.readDailyData,
    weekly: dbUtility.readWeeklyData,
    monthly: dbUtility.readMonthlyData,
    yearly: dbUtility.readYearlyData,
};
//MQTT Client Setup
const MQTT_URL = process.env.MQTT_URL ?? "mqtt://localhost:1883"; // "mqtt://localhost:1883" mqtt://192.168.1.50:1883
const TELEMETRY_TOPIC = process.env.MQTT_TELEMETRY_TOPIC ?? "telemetry/#";
const SUB_TOPICS = [
    "tele/+/module/+/minute",
    "stat/+/module/+/relay",
    "stat/+/online",
];
function isFiniteNumber(x) {
    return typeof x === "number" && Number.isFinite(x);
}
function parseTeleMinuteTopic(topic) {
    // tele/esp32-1/module/1/minute
    const m = topic.match(/^tele\/([^/]+)\/module\/(\d+)\/minute$/);
    if (!m || !m[1] || !m[2])
        return null;
    return {
        device: m[1],
        moduleId: Number(m[2])
    };
}
function parseRelayTopic(topic) {
    // stat/esp32-1/module/1/relay
    const m = topic.match(/^stat\/([^/]+)\/module\/(\d+)\/relay$/);
    if (!m || !m[1] || !m[2])
        return null;
    return {
        device: m[1],
        moduleId: Number(m[2])
    };
}
const client = mqtt_1.default.connect(MQTT_URL);
const modulesStatus = {};
function startMqttIngest() {
    client.on("connect", () => {
        console.log("[MQTT] connected:", MQTT_URL);
        client.subscribe(SUB_TOPICS, (err) => {
            if (err)
                console.error("[MQTT] subscribe error:", err);
            else
                console.log("[MQTT] subscribed:", SUB_TOPICS.join(", "));
        });
    });
    client.on("error", (err) => console.error("[MQTT] error:", err));
    client.on("message", async (topic, buf) => {
        const msg = buf.toString("utf8");
        const teleInfo = parseTeleMinuteTopic(topic);
        if (teleInfo) {
            let data;
            try {
                data = JSON.parse(msg);
            }
            catch {
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
                console.log("[DB] inserted minute:", teleInfo.device, moduleId, power);
                if (current > 0.05) {
                    const result2 = await dbUtility.setModuleStatus(moduleId, true);
                    console.log("[DB] set module status to ON for module", moduleId, result2);
                    const result3 = await dbUtility.setLastOnNow(moduleId);
                    console.log("[DB] set last_on to now for module", moduleId, result3);
                    const shouldSetLastOff = !(await dbUtility.getStatusChange(moduleId));
                    if (shouldSetLastOff) {
                        const result5 = await dbUtility.setLastOffNow(moduleId);
                        console.log("[DB] set last_off to now for module", moduleId, result5);
                        const result6 = await dbUtility.setStatusChange(moduleId, true);
                        console.log("[DB] set status change to true for module", moduleId, result6);
                    }
                }
            }
            catch (e) {
                console.error("[DB] insert failed:", e);
            }
            return;
        }
        const relayInfo = parseRelayTopic(topic);
        if (relayInfo) {
            const state = msg.trim(); // "OFF" / "ON"
            //console.log(`[MQTT] relay state ${relayInfo.device} module ${relayInfo.moduleId}: ${state}`);
            //const result = await dbUtility.setModuleStatus(relayInfo.moduleId, state === "ON");
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
async function startModuleStatusWatchdog() {
    //{"id":1,"module_id":1,"status":false,"last_on":"2026-02-13T21:00:40.551Z","last_off":"2026-02-13T21:01:05.514Z"}
    setInterval(async () => {
        const allStatus = await dbUtility.getAllModulesStatus();
        allStatus.forEach(async (row) => {
            const isStale = Date.now() - new Date(row.last_on).getTime() > 70000;
            if (row.status && isStale) {
                await dbUtility.setModuleStatus(row.module_id, false);
                await dbUtility.setLastOffNow(row.module_id);
                await dbUtility.setStatusChange(row.module_id, false);
                console.log(`[Watchdog] Set module ${row.module_id} OFF due to staleness. Last on: ${row.last_on}`);
            }
        });
    }, 10 * 1000);
}
startModuleStatusWatchdog();
startMqttIngest();
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(express_1.default.json());
function isInterval(x) {
    return typeof x === "string" && intervals.includes(x);
}
app.get("/api/last/hours", async (req, res) => {
    const data = await dbUtility.getTodayHourlyData();
    res.json(data);
});
app.get("/api/last/yesterday", async (req, res) => {
    const data = await dbUtility.getYesterdayDailyData();
    res.json(data);
});
app.get("/api/last/weeks", async (req, res) => {
    const data = await dbUtility.getThisWeekData();
    res.json(data);
});
app.get("/api/weeksByHour", async (req, res) => {
    const data = await dbUtility.getThisWeekHourlyData();
    res.json(data);
});
app.get("/api/monthsByHour", async (req, res) => {
    const data = await dbUtility.getThisMonthHourlyData();
    res.json(data);
});
app.get("/api/last/months", async (req, res) => {
    const data = await dbUtility.getLastMonthData();
    res.json(data);
});
app.get("/api/modules", async (req, res) => {
    const data = await dbUtility.readModulesData();
    res.json(data);
});
app.get("/api/module/:moduleID", async (req, res) => {
    const moduleID = req.params.moduleID;
    if (!moduleID)
        return;
    const data = await dbUtility.getLastUploadedMinuteData(moduleID);
    res.json(data);
});
app.get("/api/history", async (req, res) => {
    try {
        const data = await dbUtility.getDashboardFrontendData();
        res.json(data);
    }
    catch (err) {
        console.error("GET /api/dashboard failed:", err);
        res.status(500).json({ error: "Failed to load dashboard" });
    }
});
app.get("/api/forecasting/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const moduleId = req.query.moduleId ? Number(req.query.moduleId) : undefined;
        const hasModuleId = Number.isFinite(moduleId);
        const takeN = (arr, n) => arr.slice(0, n);
        // Build an object: { [moduleId]: points[] } and slice during build
        const buildByModule = async (fn, n) => {
            const moduleIds = await dbUtility.getModuleIds();
            const out = {};
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
                const totals = await dbUtility.getThisMonthTotals(moduleId);
                return res.json({ moduleId, ...totals });
            }
            const moduleIds = await dbUtility.getModuleIds();
            const totalsByModule = {};
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
    }
    catch (err) {
        console.error("GET /api/forecasting/:name failed:", err);
        return res.status(500).json({ error: "Failed to load forecasting data" });
    }
});
app.get("/api/:params", async (req, res) => {
    const interval = req.params.params;
    if (!isInterval(interval)) {
        return res.status(404).json({ error: "Invalid interval" });
    }
    const handler = handlers[interval];
    try {
        const data = await handler();
        res.json(data);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
// SCHEDULED PROCESSES
forecasting.doRollups();
forecasting.startPredictionScheduler();
dbUtility.fillMissingMinutesWithZeros();
// FORECASTING APIS
app.get("/api/forecastedData/minutes", async (req, res) => {
    dbUtility.getForecastedMinutes().then(data => res.json(data));
});
// dbUtility.getLast300Minutes(1).then(data => {
//   let newData = data.map(x => parseFloat(x.current));
//   forecasting.runForecastProcess("hourly", newData).then(data => {
//     console.log(data.data);
//   })
// })
app.get("/api/forecastedData/hours", async (req, res) => {
    dbUtility.getForecastedHours().then(data => res.json(data));
});
app.get("/api/forecastedData/days", async (req, res) => {
    dbUtility.getForecastedDays().then(data => res.json(data));
});
app.get("/api/forecastedData/weeks", async (req, res) => {
    dbUtility.getForecastedWeeks().then(data => res.json(data));
});
app.get("/api/forecastedData/months", async (req, res) => {
    dbUtility.getForecastedMonths().then(data => res.json(data));
});
app.get("/api/forecastedData/years", async (req, res) => {
    dbUtility.getForecastedYears().then(data => res.json(data));
});
// HANDLE SWITCHING RELAYS API
app.get("/api/switching/all", async (req, res) => {
    dbUtility.getAllModulesStatus().then(data => res.json(data));
});
app.get("/api/switching/:moduleId/status", async (req, res) => {
    const module_id = req.params.moduleId;
    dbUtility.getModuleStatus(parseInt(module_id)).then(data => {
        res.json(data);
    });
});
app.get("/api/switching/:moduleId/on", async (req, res) => {
    const module_id = parseInt(req.params.moduleId);
    const topic = `cmnd/esp32-1/module/${module_id}/relay`;
    const ok = client.publish(topic, "ON");
    await new Promise(r => setTimeout(r, 300));
    const result = await dbUtility.setModuleStatus(module_id, true);
    res.json({ status: "sent ON", topic, result });
});
app.get("/api/switching/:moduleId/off", async (req, res) => {
    const moduleId = parseInt(req.params.moduleId);
    const topic = `cmnd/esp32-1/module/${moduleId}/relay`;
    const ok = client.publish(topic, "OFF");
    if (!ok) {
        return res.status(500).json({ error: "MQTT publish failed" });
    }
    await new Promise(r => setTimeout(r, 300));
    const result = await dbUtility.setModuleStatus(moduleId, false);
    res.json({ status: "sent OFF", topic, result });
});
app.get("/api/dashboard/modules", async (_req, res) => {
    try {
        const data = await dbUtility.getDashboardModules();
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load dashboard modules" });
    }
});
// HANDLE NAMING API
app.get("/api/naming/:moduleId/name", async (req, res) => {
    const module_id = req.params.moduleId;
    dbUtility.getModuleName(parseInt(module_id)).then(data => {
        res.json(data);
    });
});
app.get("/api/naming/:moduleId/set/:name", async (req, res) => {
    const module_id = req.params.moduleId;
    const newName = req.params.name;
    const result = await dbUtility.setModuleName(parseInt(module_id), newName);
    res.json({ success: result });
});
// SERVE TESTING FILES
// SERVE CLIENT WITH DASHBOARD
app.use((_req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
console.log("App initialized");
exports.default = app;
//# sourceMappingURL=app.js.map