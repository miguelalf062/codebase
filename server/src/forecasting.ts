import path from "path";

import * as dbUtility  from "./dbUtility";
import { spawn } from "child_process";



const newPayload = []
for (let i = 0; i < 50; i++) {
  const current = 2 + Math.random() * 0.5;
  const voltage = 220 + Math.random() * 10;
  const power = current * voltage;
  newPayload.push(power);
}

type ForecastResult = {
  data: number[];
};

async function runForecastProcess(processMethod : string, data : number[]) : Promise<ForecastResult> {
  return new Promise((resolve, reject) => {
    const payload = { process: processMethod, data }
    const script = path.resolve(process.cwd(), "src/processing/predict.py");
    const PYTHON_PATH = path.resolve(
      process.cwd(),
      "src/processing/pyenv/Scripts/python.exe"
    );

    const SCRIPT_PATH = path.resolve(
      process.cwd(),
      "src/processing/predict.py"
    );

    const py = spawn(PYTHON_PATH, [SCRIPT_PATH], {
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
      } catch {
        reject(new Error("Invalid JSON from Python"));
      }
    });

    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  })
  
  
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
    if (running) return;
    running = true;

    try {
      await dbUtility.rollupHours();
      await dbUtility.rollupDays();
      await dbUtility.rollupWeeks();
      await dbUtility.rollupMonths();
      await dbUtility.rollupYears();
      console.log("✅ Rollups completed");
    } catch (err) {
      console.error("❌ Rollup error", err);
    } finally {
      running = false;
    }
};

export async function doRollups() {
    startRollups();
    setInterval(startRollups, 20 * 60 * 1000);
}

export async function generateAmountMinutes( amount : number ) {
    for (let i = 0; i< amount; i++) {
    const current = 2 + Math.random() * 0.5;
    const voltage = 220 + Math.random() * 10;
    const power = current * voltage;
    dbUtility.writeMinutesData(1, current, voltage, power);
    }
}

enum modules {
    module1 = 1,
    module2 = 2,
    module3 = 3
}

async function runHourlyForecast() { 

    console.log("running hourly forecast update...");

    dbUtility.getLast300Minutes(modules.module1).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.current))
        const voltageData = data.map(prev => parseFloat(prev.voltage))
        const powerData = data.map(prev => parseFloat(prev.power))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("hourly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("hourly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("hourly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
         forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastDaysData(modules.module1, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })
    })
    dbUtility.getLast300Minutes(modules.module2).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.current))
        const voltageData = data.map(prev => parseFloat(prev.voltage))
        const powerData = data.map(prev => parseFloat(prev.power))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("hourly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("hourly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("hourly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
         forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastDaysData(modules.module2, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })
    })
    dbUtility.getLast300Minutes(modules.module3).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.current))
        const voltageData = data.map(prev => parseFloat(prev.voltage))
        const powerData = data.map(prev => parseFloat(prev.power))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("hourly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("hourly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("hourly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
         forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastDaysData(modules.module3, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })
    })

}
async function runDailyForecast() { 

    console.log("running hourly daily update...");

    dbUtility.getLast140Hours(modules.module1).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("daily", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("daily", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("daily", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastDaysData(modules.module1, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast140Hours(modules.module2).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("daily", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("daily", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("daily", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastDaysData(modules.module2, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast140Hours(modules.module3).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("daily", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("daily", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("daily", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastDaysData(modules.module3, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })
}
async function runWeeklyForecast() {

    console.log("running weekly forecast update...");

    dbUtility.getLast14Days(modules.module1).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("weekly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("weekly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("weekly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastWeeksData(modules.module1, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast14Days(modules.module2).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("weekly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("weekly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("weekly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastWeeksData(modules.module2, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast14Days(modules.module3).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("weekly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("weekly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("weekly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastWeeksData(modules.module3, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

}
async function runMonthlyForecast() {

    console.log("running monthly forecast update...");

    dbUtility.getLast61Days(modules.module1).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("monthly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("monthly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("monthly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastMonthsData(modules.module1, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast61Days(modules.module2).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("monthly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("monthly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("monthly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastMonthsData(modules.module2, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast61Days(modules.module3).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("monthly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("monthly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("monthly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastMonthsData(modules.module3, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })
 }
async function runYearlyForecast() { 

    console.log("running yearly forecast update...");

    dbUtility.getLast24Months(modules.module1).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("yearly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("yearly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("yearly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastYearsData(modules.module1, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast24Months(modules.module2).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("yearly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("yearly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("yearly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastYearsData(modules.module2, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })

    dbUtility.getLast24Months(modules.module3).then(async (data) => {
        const currentData = data.map(prev => parseFloat(prev.avg_current))
        const voltageData = data.map(prev => parseFloat(prev.avg_voltage))
        const powerData = data.map(prev => parseFloat(prev.avg_voltage))

        const [
        forecastedCurrentData,
        forecastedVoltageData,
        forecastedPowerData
        ] = await Promise.all([
            runForecastProcess("yearly", currentData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("yearly", voltageData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            }),
            runForecastProcess("yearly", powerData).then(data => {
                if (data === null ||data === undefined) return;
                return data.data.map(prev => parseFloat(prev.toFixed(2)));
            })
         ])
        
         if (
        !forecastedCurrentData ||
        !forecastedVoltageData ||
        !forecastedPowerData
        ) {
            console.error("Forecast failed — missing data");
            return;
        }
        forecastedCurrentData.map((data, index) => {
            if (!forecastedVoltageData[index] || !forecastedPowerData[index]) return;
             dbUtility.writeForecastYearsData(modules.module3, index, data, forecastedVoltageData[index],forecastedPowerData[index])
         })

    })
 }


let running2 = false;
function fmtPH(ts: string | Date) {
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

export async function startPredictionScheduler() {
  const tick = async () => {
    if (running2) return;
    running2 = true;

    try {
      // HOURLY
      {
        const { run, bucketStart } = await dbUtility.shouldRun("hourly", "hour");
        if (run && bucketStart) {
          await runHourlyForecast();
          await dbUtility.markRan("hourly", bucketStart);
          console.log("✅ hourly forecast ran for bucket", fmtPH(bucketStart));
        }
      }

      // DAILY
      {
        const { run, bucketStart } = await dbUtility.shouldRun("daily", "day");
        if (run && bucketStart) {
          await runDailyForecast();
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
          await runMonthlyForecast();
          await dbUtility.markRan("monthly", bucketStart);
          console.log("✅ monthly forecast ran for bucket", fmtPH(bucketStart));
        }
      }

      // YEARLY
      {
        const { run, bucketStart } = await dbUtility.shouldRun("yearly", "year");
        if (run && bucketStart) {
          await runYearlyForecast();
          await dbUtility.markRan("yearly", bucketStart);
          console.log("✅ yearly forecast ran for bucket", fmtPH(bucketStart));
        }
      }
    } finally {
      running2 = false;
    }
  };
  // run once on start
  tick();
  // then every 20 minutes
  setInterval(tick, 20 * 60 * 1000);
}