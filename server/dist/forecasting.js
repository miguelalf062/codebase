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
exports.runForecastProcess = runForecastProcess;
exports.doRollups = doRollups;
exports.generateAmountMinutes = generateAmountMinutes;
exports.startPredictionScheduler = startPredictionScheduler;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const dbUtility = __importStar(require("./dbUtility"));
const child_process_1 = require("child_process");
const forecasting2 = __importStar(require("./forecasting2"));
const newPayload = [];
for (let i = 0; i < 50; i++) {
    const current = 2 + Math.random() * 0.5;
    const voltage = 220 + Math.random() * 10;
    const power = current * voltage;
    newPayload.push(power);
}
async function runForecastProcess(processMethod, data) {
    return new Promise((resolve, reject) => {
        const payload = { process: processMethod, data };
        const script = path_1.default.resolve(process.cwd(), "src/processing/predict.py");
        const isWindows = os_1.default.platform() === "win32";
        const PYTHON_PATH = path_1.default.resolve(process.cwd(), "src/processing/pyenv", isWindows ? "Scripts/python.exe" : "bin/python");
        const SCRIPT_PATH = path_1.default.resolve(process.cwd(), "src/processing/predict.py");
        const py = (0, child_process_1.spawn)(PYTHON_PATH, [SCRIPT_PATH], {
            stdio: ["pipe", "pipe", "pipe"],
        });
        let out = "";
        let err = "";
        py.stdout.on("data", (d) => (out += d.toString()));
        py.stderr.on("data", (d) => (err += d.toString()));
        py.on("close", (code) => {
            if (code !== 0) {
                return reject(new Error(err || `Python exited with ${code}`));
            }
            if (!out.trim()) {
                return reject(new Error("Python returned empty output"));
            }
            try {
                resolve(JSON.parse(out));
            }
            catch {
                reject(new Error("Invalid JSON from Python"));
            }
        });
        py.stdin.write(JSON.stringify(payload));
        py.stdin.end();
    });
}
// runForecastProcess("hourly", newPayload).then(data => {
//   if (data === null ||data === undefined) return;
//   console.log(data.data.map(prev => prev.toFixed(2)));
// })
// dbUtility.readMinutesData().then(data => {
//   const newData = data.map( oldData => parseFloat(oldData.power))
//   runForecastProcess("hourly", newData).then(data => {
//     if (data === null ||data === undefined) return;
//     console.log(data.data.map(prev => prev.toFixed(2)));
//   })
// })
let running = false;
async function startRollups() {
    if (running)
        return;
    running = true;
    try {
        await dbUtility.rollupHours();
        await dbUtility.rollupDays();
        await dbUtility.rollupWeeks();
        await dbUtility.rollupMonths();
        await dbUtility.rollupYears();
        console.log("✅ Rollups completed");
    }
    catch (err) {
        console.error("❌ Rollup error", err);
    }
    finally {
        running = false;
    }
}
;
async function doRollups() {
    startRollups();
    setInterval(startRollups, 20 * 60 * 1000);
}
async function generateAmountMinutes(amount) {
    for (let i = 0; i < amount; i++) {
        const current = 2 + Math.random() * 0.5;
        const voltage = 220 + Math.random() * 10;
        const power = current * voltage;
        dbUtility.writeMinutesData(1, current, voltage, power);
    }
}
var modules;
(function (modules) {
    modules[modules["module1"] = 1] = "module1";
    modules[modules["module2"] = 2] = "module2";
    modules[modules["module3"] = 3] = "module3";
})(modules || (modules = {}));
async function runHourlyForecast() {
    console.log("running hourly forecast update...");
    dbUtility.deleteForecastHoursData().then(res => {
        dbUtility.getLast300Minutes(modules.module1).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.current));
            const voltageData = data.map(prev => parseFloat(prev.voltage));
            const powerData = data.map(prev => parseFloat(prev.power));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("hourly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("hourly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("hourly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            console.log(forecastedCurrentData.length);
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastHoursData(modules.module1, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast300Minutes(modules.module2).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.current));
            const voltageData = data.map(prev => parseFloat(prev.voltage));
            const powerData = data.map(prev => parseFloat(prev.power));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("hourly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("hourly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("hourly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastHoursData(modules.module2, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast300Minutes(modules.module3).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.current));
            const voltageData = data.map(prev => parseFloat(prev.voltage));
            const powerData = data.map(prev => parseFloat(prev.power));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("hourly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("hourly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("hourly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastHoursData(modules.module3, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
    });
}
async function runDailyForecast() {
    console.log("running hourly daily update...");
    dbUtility.deleteForecastDaysData().then(res => {
        dbUtility.getLast140Hours(modules.module1).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("daily", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("daily", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("daily", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastDaysData(modules.module1, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast140Hours(modules.module2).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("daily", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("daily", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("daily", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastDaysData(modules.module2, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast140Hours(modules.module3).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("daily", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("daily", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("daily", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastDaysData(modules.module3, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
    });
}
async function runWeeklyForecast() {
    console.log("running weekly forecast update...");
    dbUtility.deleteForecastWeeksData().then(res => {
        dbUtility.getLast14Days(modules.module1).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("weekly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("weekly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("weekly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastWeeksData(modules.module1, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast14Days(modules.module2).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("weekly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("weekly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("weekly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastWeeksData(modules.module2, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast14Days(modules.module3).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("weekly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("weekly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("weekly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastWeeksData(modules.module3, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
    });
}
async function runMonthlyForecast() {
    console.log("running monthly forecast update...");
    dbUtility.deleteForecastMonthsData().then(res => {
        dbUtility.getLast61Days(modules.module1).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("monthly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("monthly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("monthly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastMonthsData(modules.module1, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast61Days(modules.module2).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("monthly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("monthly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("monthly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastMonthsData(modules.module2, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast61Days(modules.module3).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("monthly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("monthly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("monthly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastMonthsData(modules.module3, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
    });
}
async function runYearlyForecast() {
    console.log("running yearly forecast update...");
    dbUtility.deleteForecastYearsData().then(res => {
        dbUtility.getLast24Months(modules.module1).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("yearly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("yearly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("yearly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastYearsData(modules.module1, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast24Months(modules.module2).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("yearly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("yearly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("yearly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastYearsData(modules.module2, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
        dbUtility.getLast24Months(modules.module3).then(async (data) => {
            const currentData = data.map(prev => parseFloat(prev.avg_current));
            const voltageData = data.map(prev => parseFloat(prev.avg_voltage));
            const powerData = data.map(prev => parseFloat(prev.avg_voltage));
            const [forecastedCurrentData, forecastedVoltageData, forecastedPowerData] = await Promise.all([
                runForecastProcess("yearly", currentData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("yearly", voltageData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                }),
                runForecastProcess("yearly", powerData).then(data => {
                    if (data === null || data === undefined)
                        return;
                    return data.data.map(prev => parseFloat(prev.toFixed(2)));
                })
            ]);
            if (!forecastedCurrentData ||
                !forecastedVoltageData ||
                !forecastedPowerData) {
                console.error("Forecast failed — missing data");
                return;
            }
            forecastedCurrentData.map((data, index) => {
                if ((forecastedVoltageData[index]) == null || (forecastedPowerData[index] == null))
                    return;
                dbUtility.writeForecastYearsData(modules.module3, index, data, forecastedVoltageData[index], forecastedPowerData[index]);
            });
        });
    });
}
let running2 = false;
function fmtPH(ts) {
    return new Date(ts).toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}
async function startPredictionScheduler() {
    const tick = async () => {
        //runAll();
        async function runAll() {
            await forecasting2.runHourlyForecast();
            await forecasting2.runDailyForecast();
            await runWeeklyForecast();
            await forecasting2.runMonthlyForecast();
            await forecasting2.runYearlyForecast();
        }
        if (running2)
            return;
        running2 = true;
        try {
            // HOURLY
            {
                const { run, bucketStart } = await dbUtility.shouldRun("hourly", "hour");
                if (run && bucketStart) {
                    await forecasting2.runHourlyForecast();
                    await dbUtility.markRan("hourly", bucketStart);
                    console.log("✅ hourly forecast ran for bucket", fmtPH(bucketStart));
                }
            }
            // DAILY
            {
                const { run, bucketStart } = await dbUtility.shouldRun("daily", "day");
                if (run && bucketStart) {
                    await forecasting2.runDailyForecast();
                    await dbUtility.markRan("daily", bucketStart);
                    console.log("✅ daily forecast ran for bucket", fmtPH(bucketStart));
                }
            }
            // WEEKLY
            {
                const { run, bucketStart } = await dbUtility.shouldRun("weekly", "week");
                if (run && bucketStart) {
                    await runWeeklyForecast();
                    await dbUtility.markRan("weekly", bucketStart);
                    console.log("✅ weekly forecast ran for bucket", fmtPH(bucketStart));
                }
            }
            // MONTHLY
            {
                const { run, bucketStart } = await dbUtility.shouldRun("monthly", "month");
                if (run && bucketStart) {
                    await forecasting2.runMonthlyForecast();
                    await dbUtility.markRan("monthly", bucketStart);
                    console.log("✅ monthly forecast ran for bucket", fmtPH(bucketStart));
                }
            }
            // YEARLY
            {
                const { run, bucketStart } = await dbUtility.shouldRun("yearly", "year");
                if (run && bucketStart) {
                    await forecasting2.runYearlyForecast();
                    await dbUtility.markRan("yearly", bucketStart);
                    console.log("✅ yearly forecast ran for bucket", fmtPH(bucketStart));
                }
            }
        }
        finally {
            running2 = false;
        }
    };
    // run once on start
    tick();
    // then every 20 minutes
    setInterval(tick, 20 * 60 * 1000);
}
//# sourceMappingURL=forecasting.js.map