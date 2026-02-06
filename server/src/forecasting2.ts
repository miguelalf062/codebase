// ============================
// forecasting.ts (REPLACE your runHourlyForecast/runDailyForecast/runMonthlyForecast/runYearlyForecast with these)
// ============================

import * as dbUtility from "./dbUtility";
import { runForecastProcess } from "./forecasting"; // if you're in same file, remove this import

function to2(x: number) {
  return Number(x.toFixed(2));
}

async function forecastTriple(processName: string, currentSeries: number[], voltageSeries: number[], powerSeries: number[]) {
  const [fc, fv, fp] = await Promise.all([
    runForecastProcess(processName, currentSeries).then((r) => r.data.map(to2)),
    runForecastProcess(processName, voltageSeries).then((r) => r.data.map(to2)),
    runForecastProcess(processName, powerSeries).then((r) => r.data.map(to2)),
  ]);
  return { fc, fv, fp };
}

/**
 * HOURLY forecast
 * - input: last 300 minutes (minute table)
 * - output: forecast_data_hours with hour step = 0..N-1 (N should be 48)
 */
export async function runHourlyForecast() {
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
export async function runDailyForecast() {
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
export async function runMonthlyForecast() {
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
export async function runYearlyForecast() {
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
