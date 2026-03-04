"use strict";
// ============================
// forecasting.ts (REPLACE your runHourlyForecast/runDailyForecast/runMonthlyForecast/runYearlyForecast with these)
// ============================
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runHourlyForecast = runHourlyForecast;
exports.runDailyForecast = runDailyForecast;
exports.runMonthlyForecast = runMonthlyForecast;
exports.runYearlyForecast = runYearlyForecast;
const dbUtility = __importStar(require("./dbUtility"));
const forecasting_1 = require("./forecasting");
function to2(x) {
    return Number(x.toFixed(2));
}
async function forecastTriple(processName, currentSeries, voltageSeries, powerSeries) {
    const [fc, fv, fp] = await Promise.all([
        (0, forecasting_1.runForecastProcess)(processName, currentSeries).then((r) => r.data.map(to2)),
        (0, forecasting_1.runForecastProcess)(processName, voltageSeries).then((r) => r.data.map(to2)),
        (0, forecasting_1.runForecastProcess)(processName, powerSeries).then((r) => r.data.map(to2)),
    ]);
    return { fc, fv, fp };
}
/**
 * HOURLY forecast
 * - input: last 300 minutes (minute table)
 * - output: forecast_data_hours with hour step = 0..N-1 (N should be 48)
 */
async function runHourlyForecast() {
    console.log("running HOURLY forecast update...");
    const moduleIds = await dbUtility.getModuleIds();
    // delete once, then fill for all modules
    await dbUtility.deleteForecastHoursData();
    for (const moduleId of moduleIds) {
        const mins = await dbUtility.getLast300Minutes(moduleId);
        const currentSeries = mins.map((p) => Number(p.current));
        const voltageSeries = mins.map((p) => Number(p.voltage));
        const powerSeries = mins.map((p) => Number(p.power));
        const { fc, fv, fp } = await forecastTriple("hourly", currentSeries, voltageSeries, powerSeries);
        const n = Math.min(fc.length, fv.length, fp.length);
        for (let i = 0; i < n; i++) {
            await dbUtility.writeForecastHoursData(moduleId, i, fc[i] ?? 0, fv[i] ?? 0, fp[i] ?? 0);
        }
        console.log(`✅ HOURLY forecast inserted: module ${moduleId}, points=${n}`);
    }
}
/**
 * DAILY forecast (next 7 days typically, depends on your Python output length)
 * - input: last 140 hours (hourly table)
 * - output: forecast_data_days with day step = 0..N-1
 */
async function runDailyForecast() {
    console.log("running DAILY forecast update...");
    const moduleIds = await dbUtility.getModuleIds();
    await dbUtility.deleteForecastDaysData();
    for (const moduleId of moduleIds) {
        const hours = await dbUtility.getLast140Hours(moduleId);
        const currentSeries = hours.map((p) => Number(p.avg_current));
        const voltageSeries = hours.map((p) => Number(p.avg_voltage));
        const powerSeries = hours.map((p) => Number(p.total_power)); // ✅ FIXED (was avg_voltage)
        const { fc, fv, fp } = await forecastTriple("daily", currentSeries, voltageSeries, powerSeries);
        const n = Math.min(fc.length, fv.length, fp.length);
        for (let i = 0; i < n; i++) {
            await dbUtility.writeForecastDaysData(moduleId, i, fc[i] ?? 0, fv[i] ?? 0, fp[i] ?? 0);
        }
        console.log(`✅ DAILY forecast inserted: module ${moduleId}, points=${n}`);
    }
}
/**
 * MONTHLY forecast (your UI wants 30 days — this assumes your Python "monthly" returns ~30 points)
 * - input: last 61 days (daily table)
 * - output: forecast_data_months with month step = 0..N-1 (it's really "day steps" in your design, but stored in months table)
 *
 * NOTE: Your DB naming is confusing: forecast_data_months uses column "month" but you're using it like an index.
 * That's fine; just treat it as step index.
 */
async function runMonthlyForecast() {
    console.log("running MONTHLY forecast update...");
    const moduleIds = await dbUtility.getModuleIds();
    await dbUtility.deleteForecastMonthsData();
    for (const moduleId of moduleIds) {
        const days = await dbUtility.getLast61Days(moduleId);
        const currentSeries = days.map((p) => Number(p.avg_current));
        const voltageSeries = days.map((p) => Number(p.avg_voltage));
        const powerSeries = days.map((p) => Number(p.total_power)); // ✅ FIXED
        const { fc, fv, fp } = await forecastTriple("monthly", currentSeries, voltageSeries, powerSeries);
        const n = Math.min(fc.length, fv.length, fp.length);
        for (let i = 0; i < n; i++) {
            await dbUtility.writeForecastMonthsData(moduleId, i, fc[i] ?? 0, fv[i] ?? 0, fp[i] ?? 0);
        }
        console.log(`✅ MONTHLY forecast inserted: module ${moduleId}, points=${n}`);
    }
}
/**
 * YEARLY forecast (usually next 12 months)
 * - input: last 24 months (monthly table)
 * - output: forecast_data_years with year step = 0..N-1 (again: step index)
 */
async function runYearlyForecast() {
    console.log("running YEARLY forecast update...");
    const moduleIds = await dbUtility.getModuleIds();
    await dbUtility.deleteForecastYearsData();
    for (const moduleId of moduleIds) {
        const months = await dbUtility.getLast24Months(moduleId);
        const currentSeries = months.map((p) => Number(p.avg_current));
        const voltageSeries = months.map((p) => Number(p.avg_voltage));
        const powerSeries = months.map((p) => Number(p.total_power)); // ✅ FIXED
        const { fc, fv, fp } = await forecastTriple("yearly", currentSeries, voltageSeries, powerSeries);
        const n = Math.min(fc.length, fv.length, fp.length);
        for (let i = 0; i < n; i++) {
            await dbUtility.writeForecastYearsData(moduleId, i, fc[i] ?? 0, fv[i] ?? 0, fp[i] ?? 0);
        }
        console.log(`✅ YEARLY forecast inserted: module ${moduleId}, points=${n}`);
    }
}
//# sourceMappingURL=forecasting2.js.map