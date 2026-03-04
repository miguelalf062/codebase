"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readModulesData = readModulesData;
exports.getModuleIds = getModuleIds;
exports.readMinutesData = readMinutesData;
exports.readHoursData = readHoursData;
exports.readDailyData = readDailyData;
exports.readWeeklyData = readWeeklyData;
exports.readMonthlyData = readMonthlyData;
exports.readYearlyData = readYearlyData;
exports.writeMinutesData = writeMinutesData;
exports.writeHourlyData = writeHourlyData;
exports.writeDailyData = writeDailyData;
exports.writeWeeklyData = writeWeeklyData;
exports.writeMonthlyData = writeMonthlyData;
exports.writeYearlyData = writeYearlyData;
exports.writeForecastMinutesData = writeForecastMinutesData;
exports.writeForecastWeeksData = writeForecastWeeksData;
exports.writeForecastHoursData = writeForecastHoursData;
exports.writeForecastDaysData = writeForecastDaysData;
exports.writeForecastMonthsData = writeForecastMonthsData;
exports.writeForecastYearsData = writeForecastYearsData;
exports.deleteForecastHoursData = deleteForecastHoursData;
exports.deleteForecastDaysData = deleteForecastDaysData;
exports.deleteForecastWeeksData = deleteForecastWeeksData;
exports.deleteForecastMonthsData = deleteForecastMonthsData;
exports.deleteForecastYearsData = deleteForecastYearsData;
exports.rollupHours = rollupHours;
exports.rollupDays = rollupDays;
exports.rollupWeeks = rollupWeeks;
exports.rollupMonths = rollupMonths;
exports.rollupYears = rollupYears;
exports.shouldRun = shouldRun;
exports.markRan = markRan;
exports.fillMissingMinutesWithZeros = fillMissingMinutesWithZeros;
exports.getLastUploadedMinuteData = getLastUploadedMinuteData;
exports.getLast300Minutes = getLast300Minutes;
exports.getLast140Hours = getLast140Hours;
exports.getTodayHourlyData = getTodayHourlyData;
exports.getYesterdayDailyData = getYesterdayDailyData;
exports.getThisWeekData = getThisWeekData;
exports.getThisWeekHourlyData = getThisWeekHourlyData;
exports.getThisMonthHourlyData = getThisMonthHourlyData;
exports.getThisMonthData = getThisMonthData;
exports.getLastMonthData = getLastMonthData;
exports.getLast14Weeks = getLast14Weeks;
exports.getLast61Days = getLast61Days;
exports.getLast14Days = getLast14Days;
exports.getLast61Months = getLast61Months;
exports.getLast24Months = getLast24Months;
exports.getLast24Years = getLast24Years;
exports.getForecastWindows = getForecastWindows;
exports.getForecastedMinutes = getForecastedMinutes;
exports.getForecastedHours = getForecastedHours;
exports.getForecastedDays = getForecastedDays;
exports.getForecastedWeeks = getForecastedWeeks;
exports.getForecastedMonths = getForecastedMonths;
exports.getForecastedYears = getForecastedYears;
exports.getAllModulesStatus = getAllModulesStatus;
exports.getModuleStatus = getModuleStatus;
exports.setModuleStatus = setModuleStatus;
exports.getModuleName = getModuleName;
exports.setModuleName = setModuleName;
exports.getDashboardModules = getDashboardModules;
exports.getDashboardTotals = getDashboardTotals;
exports.getModuleLast24Hours = getModuleLast24Hours;
exports.getModuleLast30Days = getModuleLast30Days;
exports.getModuleLast12Months = getModuleLast12Months;
exports.getModuleLiveStatus = getModuleLiveStatus;
exports.getDashboardFrontendData = getDashboardFrontendData;
exports.getRemainingForecastHoursForToday = getRemainingForecastHoursForToday;
exports.getTodayActualHours = getTodayActualHours;
exports.getTodayActualAndRemainingForecast = getTodayActualAndRemainingForecast;
exports.getForecastHours24 = getForecastHours24;
exports.getForecastDaysWindow = getForecastDaysWindow;
exports.getThisMonthTotals = getThisMonthTotals;
exports.getForecastHours24_Limit = getForecastHours24_Limit;
exports.getForecastDays7_Limit = getForecastDays7_Limit;
exports.getForecastDays30_Limit = getForecastDays30_Limit;
exports.getActualHours24 = getActualHours24;
exports.getActualDays7 = getActualDays7;
exports.getActualDays30 = getActualDays30;
exports.getActualHours24_AllModules = getActualHours24_AllModules;
exports.getActualDays7_AllModules = getActualDays7_AllModules;
exports.getActualDays30_AllModules = getActualDays30_AllModules;
exports.getForecastHours24_AllModules = getForecastHours24_AllModules;
exports.getForecastDays7_AllModules = getForecastDays7_AllModules;
exports.getForecastDays30_AllModules = getForecastDays30_AllModules;
exports.setLastOnNow = setLastOnNow;
exports.setLastOffNow = setLastOffNow;
exports.setStatusChange = setStatusChange;
exports.getStatusChange = getStatusChange;
const index_1 = require("./db/index");
async function readModulesData() {
    const res = await index_1.pool.query("SELECT * FROM modules");
    return res.rows;
}
async function getModuleIds() {
    const { rows } = await index_1.pool.query(`SELECT id FROM modules ORDER BY id ASC;`);
    return rows.map((r) => r.id);
}
async function readMinutesData() {
    const res = await index_1.pool.query("SELECT * FROM module_data_minute");
    return res.rows;
}
async function readHoursData() {
    const res = await index_1.pool.query("SELECT * FROM module_data_hourly");
    return res.rows;
}
async function readDailyData() {
    const res = await index_1.pool.query("SELECT * FROM module_data_daily");
    return res.rows;
}
async function readWeeklyData() {
    const res = await index_1.pool.query("SELECT * FROM module_data_weekly");
    return res.rows;
}
async function readMonthlyData() {
    const res = await index_1.pool.query("SELECT * FROM module_data_monthly");
    return res.rows;
}
async function readYearlyData() {
    const res = await index_1.pool.query("SELECT * FROM module_data_yearly");
    return res.rows;
}
async function writeMinutesData(moduleID, current, voltage, power) {
    const res = await index_1.pool.query(`INSERT INTO module_data_minute(module_id, current, voltage, power) VALUES(${moduleID}, ${current}, ${voltage}, ${power});`);
    return res;
}
async function writeHourlyData(moduleID, current, voltage, power) {
    const res = await index_1.pool.query(`INSERT INTO module_data_minute(module_id, current, voltage, power) VALUES(${moduleID}, ${current}, ${voltage}, ${power});`);
    return res;
}
async function writeDailyData(moduleID, day, avg_current, avg_voltage, total_power) {
    const res = await index_1.pool.query(`INSERT INTO module_data_daily(module_id, day, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${day}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}
async function writeWeeklyData(moduleID, week_start, avg_current, avg_voltage, total_power) {
    const res = await index_1.pool.query(`INSERT INTO module_data_weekly(module_id, week_start, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${week_start}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}
async function writeMonthlyData(moduleID, month_start, avg_current, avg_voltage, total_power) {
    const res = await index_1.pool.query(`INSERT INTO module_data_weekly(module_id, month_start, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${month_start}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}
async function writeYearlyData(moduleID, year_start, avg_current, avg_voltage, total_power) {
    const res = await index_1.pool.query(`INSERT INTO module_data_weekly(module_id, year_start, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${year_start}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}
async function writeForecastMinutesData(moduleID, minute, current, voltage, power) {
    const res = await index_1.pool.query(`INSERT INTO forecast_data_minutes(module_id, minute, current, voltage, power) VALUES(${moduleID}, ${minute}, ${current}, ${voltage}, ${power});`);
    return res;
}
// export async function writeForecastHoursData(moduleID: number, hour: number, current: number, voltage: number, power: number) {
//   const res = await pool.query(`INSERT INTO forecast_data_hours(module_id, hour, current, voltage, power) VALUES(${moduleID}, ${hour}, ${current}, ${voltage}, ${power});`);
//   return res;
// }
// export async function writeForecastDaysData(moduleID: number, day: number, current: number, voltage: number, power: number) {
//   const res = await pool.query(`INSERT INTO forecast_data_days(module_id, day, current, voltage, power) VALUES(${moduleID}, ${day}, ${current}, ${voltage}, ${power});`);
//     return res;
// }
async function writeForecastWeeksData(moduleID, week, current, voltage, power) {
    const res = await index_1.pool.query(`INSERT INTO forecast_data_weeks(module_id, week, current, voltage, power) VALUES(${moduleID}, ${week}, ${current}, ${voltage}, ${power});`);
    return res;
}
// export async function writeForecastMonthsData(moduleID: number, month: number, current: number, voltage: number, power: number) {
//   const res = await pool.query(`INSERT INTO forecast_data_months(module_id, month, current, voltage, power) VALUES(${moduleID}, ${month}, ${current}, ${voltage}, ${power});`);
//     return res;
// }
// export async function writeForecastYearsData(moduleID: number, year: number, current: number, voltage: number, power: number) {
//   const res = await pool.query(`INSERT INTO forecast_data_years(module_id, year, current, voltage, power) VALUES(${moduleID}, ${year}, ${current}, ${voltage}, ${power});`);
//     return res;
// }
async function writeForecastHoursData(moduleID, hour, current, voltage, power) {
    return index_1.pool.query(`
    INSERT INTO forecast_data_hours(module_id, hour, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `, [moduleID, hour, current, voltage, power]);
}
async function writeForecastDaysData(moduleID, day, current, voltage, power) {
    return index_1.pool.query(`
    INSERT INTO forecast_data_days(module_id, day, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `, [moduleID, day, current, voltage, power]);
}
async function writeForecastMonthsData(moduleID, month, current, voltage, power) {
    return index_1.pool.query(`
    INSERT INTO forecast_data_months(module_id, month, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `, [moduleID, month, current, voltage, power]);
}
async function writeForecastYearsData(moduleID, year, current, voltage, power) {
    return index_1.pool.query(`
    INSERT INTO forecast_data_years(module_id, year, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `, [moduleID, year, current, voltage, power]);
}
async function deleteForecastHoursData() {
    const res = await index_1.pool.query(`DELETE FROM forecast_data_hours`);
    return res;
}
async function deleteForecastDaysData() {
    const res = await index_1.pool.query(`DELETE FROM forecast_data_days`);
    return res;
}
async function deleteForecastWeeksData() {
    const res = await index_1.pool.query(`DELETE FROM forecast_data_weeks`);
    return res;
}
async function deleteForecastMonthsData() {
    const res = await index_1.pool.query(`DELETE FROM forecast_data_hours`);
    return res;
}
async function deleteForecastYearsData() {
    const res = await index_1.pool.query(`DELETE FROM forecast_data_years`);
    return res;
}
async function rollupHours() {
    await index_1.pool.query(`
    INSERT INTO module_data_hourly (
      module_id,
      hour_start,
      avg_current,
      avg_voltage,
      total_power
    )
    SELECT
      module_id,
      date_trunc('hour', timestamp) AS hour_start,
      ROUND(AVG(current), 2) AS avg_current,
      ROUND(AVG(voltage), 2) AS avg_voltage,
      ROUND(AVG(power), 2) AS total_power
    FROM module_data_minute
    WHERE timestamp < date_trunc('hour', NOW()) -- completed hours only
    GROUP BY module_id, hour_start
    ON CONFLICT (module_id, hour_start)
    DO UPDATE SET
      avg_current = EXCLUDED.avg_current,
      avg_voltage = EXCLUDED.avg_voltage,
      total_power = EXCLUDED.total_power;
  `);
}
/**
 * Daily rollup -> module_data_daily
 * PK: (module_id, day) date
 */
async function rollupDays() {
    await index_1.pool.query(`
    INSERT INTO module_data_daily (
      module_id,
      day,
      avg_current,
      avg_voltage,
      total_power
    )
    SELECT
      module_id,
      date_trunc('day', timestamp)::date AS day,
      ROUND(AVG(current), 2) AS avg_current,
      ROUND(AVG(voltage), 2) AS avg_voltage,
      ROUND(SUM(power), 2) AS total_power
    FROM module_data_hourly
    WHERE timestamp < date_trunc('day', NOW()) -- completed days only
    GROUP BY module_id, day
    ON CONFLICT (module_id, day)
    DO UPDATE SET
      avg_current = EXCLUDED.avg_current,
      avg_voltage = EXCLUDED.avg_voltage,
      total_power = EXCLUDED.total_power;
  `);
}
/**
 * Weekly rollup -> module_data_weekly
 * PK: (module_id, week_start) date
 * Postgres week startimestamp Monday
 */
async function rollupWeeks() {
    await index_1.pool.query(`
    INSERT INTO module_data_weekly (
      module_id,
      week_start,
      avg_current,
      avg_voltage,
      total_power
    )
    SELECT
      module_id,
      date_trunc('week', timestamp)::date AS week_start,
      ROUND(AVG(current), 2) AS avg_current,
      ROUND(AVG(voltage), 2) AS avg_voltage,
      ROUND(SUM(power), 2) AS total_power
    FROM module_data_hourly
    WHERE timestamp < date_trunc('week', NOW()) -- completed weeks only
    GROUP BY module_id, week_start
    ON CONFLICT (module_id, week_start)
    DO UPDATE SET
      avg_current = EXCLUDED.avg_current,
      avg_voltage = EXCLUDED.avg_voltage,
      total_power = EXCLUDED.total_power;
  `);
}
/**
 * Monthly rollup -> module_data_monthly
 * PK: (module_id, month_start) date
 */
async function rollupMonths() {
    await index_1.pool.query(`
    INSERT INTO module_data_monthly (
      module_id,
      month_start,
      avg_current,
      avg_voltage,
      total_power
    )
    SELECT
      module_id,
      date_trunc('month', timestamp)::date AS month_start,
      ROUND(AVG(current), 2) AS avg_current,
      ROUND(AVG(voltage), 2) AS avg_voltage,
      ROUND(SUM(power), 2) AS total_power
    FROM module_data_daily
    WHERE timestamp < date_trunc('month', NOW()) -- completed months only
    GROUP BY module_id, month_start
    ON CONFLICT (module_id, month_start)
    DO UPDATE SET
      avg_current = EXCLUDED.avg_current,
      avg_voltage = EXCLUDED.avg_voltage,
      total_power = EXCLUDED.total_power;
  `);
}
/**
 * Yearly rollup -> module_data_yearly
 * PK: (module_id, year_start) date
 */
async function rollupYears() {
    await index_1.pool.query(`
    INSERT INTO module_data_yearly (
      module_id,
      year_start,
      avg_current,
      avg_voltage,
      total_power
    )
    SELECT
      module_id,
      date_trunc('year', timestamp)::date AS year_start,
      ROUND(AVG(current), 2) AS avg_current,
      ROUND(AVG(voltage), 2) AS avg_voltage,
      ROUND(SUM(power), 2) AS total_power
    FROM module_data_monthly
    WHERE timestamp < date_trunc('year', NOW()) -- completed years only
    GROUP BY module_id, year_start
    ON CONFLICT (module_id, year_start)
    DO UPDATE SET
      avg_current = EXCLUDED.avg_current,
      avg_voltage = EXCLUDED.avg_voltage,
      total_power = EXCLUDED.total_power;
  `);
}
async function shouldRun(jobName, unit) {
    const result = await index_1.pool.query(`
    WITH latest AS (
      SELECT (date_trunc($1, now()) - ('1 ' || $1)::interval) AS latest_done
    ),
    prev AS (
      SELECT last_bucket_start AS last_done
      FROM prediction_runs
      WHERE job_name = $2
    )
    SELECT
      (SELECT latest_done FROM latest) AS latest_done,
      COALESCE(
        (SELECT last_done FROM prev) IS DISTINCT FROM (SELECT latest_done FROM latest),
        true
      ) AS run;
    `, [unit, jobName]);
    const row = result.rows[0];
    if (!row) {
        // Should basically never happen, but keeps TS + runtime safe
        return { run: false, bucketStart: new Date().toISOString() };
    }
    return {
        run: row.run,
        bucketStart: row.latest_done,
    };
}
async function markRan(jobName, bucketStart) {
    await index_1.pool.query(`
    INSERT INTO prediction_runs (job_name, last_bucket_start)
    VALUES ($1, $2::timestamptz)
    ON CONFLICT (job_name)
    DO UPDATE SET last_bucket_start = EXCLUDED.last_bucket_start;
    `, [jobName, bucketStart]);
}
async function fillMissingMinutesWithZeros() {
    await index_1.pool.query(`
    WITH last_seen AS (
      SELECT
        m.id AS module_id,
        COALESCE(
          MAX(md."timestamp"),
          date_trunc('minute', NOW()) - INTERVAL '1 minute'
        ) AS last_ts
      FROM modules m
      LEFT JOIN module_data_minute md
        ON md.module_id = m.id
      GROUP BY m.id
    ),
    missing AS (
      SELECT
        ls.module_id,
        gs."timestamp"
      FROM last_seen ls
      CROSS JOIN LATERAL generate_series(
        date_trunc('minute', ls.last_ts) + INTERVAL '1 minute',
        date_trunc('minute', NOW()),
        INTERVAL '1 minute'
      ) AS gs("timestamp")
    )
    INSERT INTO module_data_minute (
      module_id,
      "timestamp",
      current,
      voltage,
      power
    )
    SELECT
      module_id,
      "timestamp",
      0::numeric(10,2),
      0::numeric(10,2),
      0::numeric(10,2)
    FROM missing
    ON CONFLICT (module_id, "timestamp") DO NOTHING;
  `);
}
async function getLastUploadedMinuteData(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, current, voltage, power, timestamp
    FROM module_data_minute
    WHERE module_id = $1
    ORDER BY timestamp DESC
    LIMIT 1;
    `, [moduleId]);
    return rows[0] ?? null;
}
async function getLast300Minutes(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, current, voltage, power, "timestamp" AS timestamp
    FROM module_data_minute
    WHERE module_id = $1
    ORDER BY "timestamp" DESC
    LIMIT 300;
    `, [moduleId]);
    return rows.reverse();
}
async function getLast140Hours(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE module_id = $1
    ORDER BY hour_start DESC
    LIMIT 140;
    `, [moduleId]);
    return rows.reverse();
}
async function getTodayHourlyData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('day', NOW())
      AND hour_start <  date_trunc('day', NOW()) + INTERVAL '1 day'
    ORDER BY hour_start ASC;
    `);
    return rows;
}
async function getYesterdayDailyData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, day, avg_current, avg_voltage, total_power
    FROM module_data_daily
    WHERE day = date_trunc('day', NOW()) - INTERVAL '1 day'
    ORDER BY module_id;
    `);
    return rows;
}
async function getThisWeekData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, week_start, avg_current, avg_voltage, total_power
    FROM module_data_weekly
    WHERE week_start >= date_trunc('week', NOW())
      AND week_start <  date_trunc('week', NOW()) + INTERVAL '1 week'
    ORDER BY week_start ASC;
    `);
    return rows;
}
async function getThisWeekHourlyData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('week', NOW())
      AND hour_start <  date_trunc('week', NOW()) + INTERVAL '1 week'
    ORDER BY hour_start ASC;
    `);
    return rows;
}
async function getThisMonthHourlyData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('month', NOW())
      AND hour_start <  date_trunc('month', NOW()) + INTERVAL '1 month'
    ORDER BY hour_start ASC;
    `);
    return rows;
}
async function getThisMonthData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE month_start >= date_trunc('month', NOW())
      AND month_start <  date_trunc('month', NOW()) + INTERVAL '1 month'
    ORDER BY month_start ASC;
    `);
    return rows;
}
async function getLastMonthData() {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE month_start >= date_trunc('month', NOW()) - INTERVAL '1 month'
      AND month_start <  date_trunc('month', NOW())
    ORDER BY module_id;
    `);
    return rows;
}
async function getLast14Weeks(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, week_start, avg_current, avg_voltage, total_power
    FROM module_data_weekly
    WHERE module_id = $1
    ORDER BY week_start DESC
    LIMIT 14;
    `, [moduleId]);
    return rows.reverse();
}
async function getLast61Days(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, day, avg_current, avg_voltage, total_power
    FROM module_data_daily
    WHERE module_id = $1
    ORDER BY day DESC
    LIMIT 61;
    `, [moduleId]);
    return rows.reverse();
}
async function getLast14Days(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, day, avg_current, avg_voltage, total_power
    FROM module_data_daily
    WHERE module_id = $1
    ORDER BY day DESC
    LIMIT 14;
    `, [moduleId]);
    return rows.reverse();
}
async function getLast61Months(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE module_id = $1
    ORDER BY month_start DESC
    LIMIT 61;
    `, [moduleId]);
    return rows.reverse();
}
async function getLast24Months(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE module_id = $1
    ORDER BY month_start DESC
    LIMIT 24;
    `, [moduleId]);
    return rows.reverse();
}
async function getLast24Years(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, year_start, avg_current, avg_voltage, total_power
    FROM module_data_yearly
    WHERE module_id = $1
    ORDER BY year_start DESC
    LIMIT 24;
    `, [moduleId]);
    return rows.reverse();
}
async function getForecastWindows(moduleId) {
    const [minutes300, hours140, weeks14, months61, years24] = await Promise.all([
        getLast300Minutes(moduleId),
        getLast140Hours(moduleId),
        getLast14Weeks(moduleId),
        getLast61Months(moduleId),
        getLast24Years(moduleId),
    ]);
    return { minutes300, hours140, weeks14, months61, years24 };
}
async function getForecastedMinutes() {
    const res = await index_1.pool.query("SELECT * FROM forecast_data_minutes");
    return res.rows;
}
async function getForecastedHours() {
    const res = await index_1.pool.query("SELECT * FROM forecast_data_hours");
    return res.rows;
}
async function getForecastedDays() {
    const res = await index_1.pool.query("SELECT * FROM forecast_data_days");
    return res.rows;
}
async function getForecastedWeeks() {
    const res = await index_1.pool.query("SELECT * FROM forecast_data_weeks");
    return res.rows;
}
async function getForecastedMonths() {
    const res = await index_1.pool.query("SELECT * FROM forecast_data_months");
    return res.rows;
}
async function getForecastedYears() {
    const res = await index_1.pool.query("SELECT * FROM forecast_data_years");
    return res.rows;
}
async function getAllModulesStatus() {
    const res = await index_1.pool.query(`SELECT * FROM switching_data`);
    return res.rows;
}
async function getModuleStatus(module_id) {
    const res = await index_1.pool.query(`SELECT * FROM switching_data WHERE module_id=${module_id}`);
    return res.rows[0];
}
async function setModuleStatus(module_id, status) {
    if (status) {
        await index_1.pool.query(`UPDATE switching_data SET status=TRUE, last_on=now() WHERE module_id=${module_id}`);
    }
    else {
        await index_1.pool.query(`UPDATE switching_data SET status=FALSE, last_off=now() WHERE module_id=${module_id}`);
    }
}
async function getModuleName(module_id) {
    const res = await index_1.pool.query(`SELECT * FROM naming_data WHERE module_id=${module_id}`);
    return res.rows[0];
}
async function setModuleName(module_id, newName) {
    await index_1.pool.query(`UPDATE naming_data SET past_module = module_name WHERE module_id=${module_id}`).then(async (data) => {
        await index_1.pool.query(`UPDATE naming_data SET module_name = ${newName} WHERE module_id=${module_id}`);
    });
}
async function getDashboardModules() {
    const { rows } = await index_1.pool.query(`
    WITH latest AS (
      SELECT DISTINCT ON (m.module_id)
        m.module_id,
        m.timestamp,
        m.current,
        m.voltage,
        m.power
      FROM module_data_minute m
      ORDER BY m.module_id, m.timestamp DESC
    ),
    module_ids AS (
      SELECT module_id FROM module_data_minute
      UNION
      SELECT module_id FROM naming_data
      UNION
      SELECT module_id FROM switching_data
    )
    SELECT
      ids.module_id,
      n.module_name,
      s.status,
      l.current,
      l.voltage,
      l.power,
      l.timestamp
    FROM module_ids ids
    LEFT JOIN latest l
      ON l.module_id = ids.module_id
    LEFT JOIN naming_data n
      ON n.module_id = ids.module_id
    LEFT JOIN switching_data s
      ON s.module_id = ids.module_id
    ORDER BY ids.module_id ASC;
  `);
    return rows.map((x) => ({
        id: x.module_id,
        name: x.module_name ?? `Module ${x.module_id}`,
        status: x.status ?? false,
        current: Number(x.current ?? 0),
        voltage: Number(x.voltage ?? 0),
        power: Number(x.power ?? 0),
        timeStamp: x.timestamp,
    }));
}
function toNumber(x) {
    return x == null ? 0 : Number(x);
}
async function getDashboardTotals() {
    const q = `
    WITH
    d30 AS (
      SELECT
        to_char(day::date, 'YYYY-MM-DD') AS day,
        SUM(total_power)::numeric(14,2) AS value
      FROM module_data_daily
      WHERE day >= (date_trunc('day', now())::date - interval '29 days')
      GROUP BY 1
      ORDER BY 1
    ),
    m12 AS (
      SELECT
        to_char(month_start::date, 'YYYY-MM') AS month,
        SUM(total_power)::numeric(14,2) AS value
      FROM module_data_monthly
      WHERE month_start >= (date_trunc('month', now())::date - interval '11 months')
      GROUP BY 1
    ),
    this_m AS (
      SELECT COALESCE(SUM(total_power), 0)::numeric(14,2) AS value
      FROM module_data_monthly
      WHERE month_start = date_trunc('month', now())::date
    ),
    last_m AS (
      SELECT COALESCE(SUM(total_power), 0)::numeric(14,2) AS value
      FROM module_data_monthly
      WHERE month_start = (date_trunc('month', now())::date - interval '1 month')
    )
    SELECT
      (SELECT json_agg(json_build_object('day', day, 'value', value) ORDER BY day) FROM d30) AS last30,
      (SELECT json_build_object('month', month, 'value', value) FROM m12 ORDER BY value DESC NULLS LAST LIMIT 1) AS highest,
      (SELECT json_build_object('month', month, 'value', value) FROM m12 ORDER BY value ASC  NULLS LAST LIMIT 1) AS lowest,
      (SELECT COALESCE(AVG(value), 0)::numeric(14,2) FROM d30) AS avg_day,
      (SELECT COALESCE(AVG(value), 0)::numeric(14,2) FROM m12) AS avg_month,
      (SELECT value FROM last_m) AS last_month_total,
      (SELECT value FROM this_m) AS this_month_total
    ;
  `;
    const { rows } = await index_1.pool.query(q);
    const r = rows[0];
    return {
        last30DaysTotal: (r.last30 ?? []),
        highestUsageMonth: r.highest ?? null,
        lowestUsageMonth: r.lowest ?? null,
        avgPerDay: toNumber(r.avg_day),
        avgPerMonth: toNumber(r.avg_month),
        lastMonthTotal: toNumber(r.last_month_total),
        thisMonthTotal: toNumber(r.this_month_total),
    };
}
async function getModuleLast24Hours(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT
      to_char(hour_start, 'MM-DD HH24:00') AS day,
      COALESCE(total_power, 0)::numeric(14,2) AS value
    FROM module_data_hourly
    WHERE module_id = $1
      AND hour_start >= (date_trunc('hour', now()) - interval '23 hours')
    ORDER BY hour_start ASC;
    `, [moduleId]);
    return rows.map((r) => ({ day: r.day, value: toNumber(r.value) }));
}
async function getModuleLast30Days(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT
      to_char(day::date, 'YYYY-MM-DD') AS day,
      COALESCE(total_power, 0)::numeric(14,2) AS value
    FROM module_data_daily
    WHERE module_id = $1
      AND day >= (date_trunc('day', now())::date - interval '29 days')
    ORDER BY day ASC;
    `, [moduleId]);
    return rows.map((r) => ({ day: r.day, value: toNumber(r.value) }));
}
async function getModuleLast12Months(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT
      to_char(month_start::date, 'YYYY-MM') AS day,
      COALESCE(total_power, 0)::numeric(14,2) AS value
    FROM module_data_monthly
    WHERE module_id = $1
      AND month_start >= (date_trunc('month', now())::date - interval '11 months')
    ORDER BY month_start ASC;
    `, [moduleId]);
    return rows.map((r) => ({ day: r.day, value: toNumber(r.value) }));
}
async function getModuleLiveStatus(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, status, last_on, last_off
    FROM switching_data
    WHERE module_id = $1
    LIMIT 1;
    `, [moduleId]);
    const r = rows[0];
    if (!r) {
        return { deviceLastOn: null, isCurrentlyOn: false, deviceCurrentActiveTimeSec: 0 };
    }
    // If status=TRUE, active time = now - last_on. Else 0.
    const activeRes = await index_1.pool.query(`
    SELECT
      CASE
        WHEN $2::boolean = true AND $1::timestamptz IS NOT NULL
        THEN EXTRACT(EPOCH FROM (now() - $1::timestamptz))::bigint
        ELSE 0
      END AS active_sec
    `, [r.last_on, r.status]);
    return {
        deviceLastOn: r.last_on ? new Date(r.last_on).toISOString() : null,
        isCurrentlyOn: Boolean(r.status),
        deviceCurrentActiveTimeSec: Number(activeRes.rows[0]?.active_sec ?? 0),
    };
}
async function getDashboardFrontendData() {
    const totals = await getDashboardTotals();
    const { rows: mods } = await index_1.pool.query(`SELECT id, name FROM modules ORDER BY id ASC;`);
    const modules = await Promise.all(mods.map(async (m) => {
        const [d24, d30, m12, st] = await Promise.all([
            getModuleLast24Hours(m.id),
            getModuleLast30Days(m.id),
            getModuleLast12Months(m.id),
            getModuleLiveStatus(m.id),
        ]);
        return {
            module_id: m.id,
            deviceName: m.name,
            dailyPowerConsumption: d24,
            monthlyPowerConsumption: d30,
            yearlyPowerConsumption: m12,
            deviceLastOn: st.deviceLastOn,
            isCurrentlyOn: st.isCurrentlyOn,
            deviceCurrentActiveTimeSec: st.deviceCurrentActiveTimeSec,
        };
    }));
    return { totals, modules };
}
async function getRemainingForecastHoursForToday(moduleId) {
    const { rows } = await index_1.pool.query(`
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_hours
      WHERE module_id = $1
    )
    SELECT
      f.module_id,
      (date_trunc('hour', l.ft) + (f.hour || ' hour')::interval) AS hour_start,
      f.power::numeric(14,2) AS total_power
    FROM forecast_data_hours f
    JOIN latest l ON f.forecast_timestamp = l.ft
    WHERE f.module_id = $1
      -- remaining hours for *today*
      AND (date_trunc('hour', l.ft) + (f.hour || ' hour')::interval) >= date_trunc('hour', now())
      AND (date_trunc('hour', l.ft) + (f.hour || ' hour')::interval) <  date_trunc('day', now()) + interval '1 day'
    ORDER BY hour_start ASC;
    `, [moduleId]);
    return rows;
}
async function getTodayActualHours(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT module_id, hour_start, total_power
    FROM module_data_hourly
    WHERE module_id = $1
      AND hour_start >= date_trunc('day', now())
      AND hour_start <  date_trunc('day', now()) + interval '1 day'
    ORDER BY hour_start ASC;
    `, [moduleId]);
    return rows;
}
async function getTodayActualAndRemainingForecast(moduleId) {
    const [actual, forecast] = await Promise.all([
        getTodayActualHours(moduleId),
        getRemainingForecastHoursForToday(moduleId),
    ]);
    const boundaryHourStart = actual.length ? actual[actual.length - 1].hour_start : null;
    return { moduleId, boundaryHourStart, actual, forecast };
}
function num(x) {
    return x == null ? 0 : Number(x);
}
async function getForecastHours24(moduleId) {
    const params = [];
    const whereModuleForecast = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND f.module_id = $${params.length}`)
        : "";
    const q = `
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_hours f
      WHERE 1=1 ${whereModuleForecast}
    ),
    forecast AS (
      SELECT
        (date_trunc('hour', latest.ft) + (f.hour || ' hour')::interval) AS bucket_start,
        SUM(f.power)::numeric(14,2) AS total_power
      FROM forecast_data_hours f
      JOIN latest ON f.forecast_timestamp = latest.ft
      WHERE 1=1 ${whereModuleForecast}
      GROUP BY 1
      ORDER BY bucket_start ASC
      LIMIT 24
    ),
    actual AS (
      SELECT
        hour_start AS bucket_start,
        SUM(total_power)::numeric(14,2) AS total_power
      FROM module_data_hourly
      WHERE hour_start >= date_trunc('hour', now()) - interval '23 hours'
        AND hour_start <= date_trunc('hour', now())
        ${Number.isFinite(moduleId) ? `AND module_id = $${params.length + 1}` : ""}
      GROUP BY 1
      ORDER BY bucket_start ASC
    )
    SELECT
      (SELECT json_agg(actual ORDER BY bucket_start) FROM actual) AS actual,
      (SELECT json_agg(forecast ORDER BY bucket_start) FROM forecast) AS forecast,
      (SELECT ft FROM latest) AS forecast_timestamp
  `;
    if (Number.isFinite(moduleId))
        params.push(moduleId);
    const { rows } = await index_1.pool.query(q, params);
    const r = rows[0];
    return {
        forecastTimestamp: r.forecast_timestamp,
        actual: r.actual ?? [],
        forecast: r.forecast ?? [],
    };
}
async function getForecastDaysWindow(daysAhead, moduleId) {
    const params = [daysAhead];
    const whereModuleActual = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND module_id = $${params.length}`)
        : "";
    const whereModuleForecast = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND f.module_id = $${params.length}`)
        : "";
    const q = `
    WITH bounds AS (
      SELECT
        date_trunc('day', now())::date AS start_day,
        (date_trunc('day', now())::date + ($1::int || ' days')::interval)::date AS end_day
    ),
    actual AS (
      SELECT
        day::date AS bucket_start,
        SUM(total_power)::numeric(14,2) AS total_power
      FROM module_data_daily, bounds
      WHERE day >= bounds.start_day
        AND day <  bounds.end_day
        ${whereModuleActual}
      GROUP BY 1
      ORDER BY 1
    ),
    latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_days f
      WHERE 1=1 ${whereModuleForecast}
    ),
    forecast AS (
      SELECT
        (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date AS bucket_start,
        SUM(f.power)::numeric(14,2) AS total_power
      FROM forecast_data_days f
      JOIN latest ON f.forecast_timestamp = latest.ft
      JOIN bounds ON true
      WHERE (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date >= bounds.start_day
        AND (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date <  bounds.end_day
        ${whereModuleForecast}
      GROUP BY 1
      ORDER BY 1
    )
    SELECT
      (SELECT json_agg(actual ORDER BY bucket_start) FROM actual) AS actual,
      (SELECT json_agg(forecast ORDER BY bucket_start) FROM forecast) AS forecast,
      (SELECT start_day FROM bounds) AS window_start,
      (SELECT end_day FROM bounds) AS window_end
  `;
    const { rows } = await index_1.pool.query(q, params);
    const r = rows[0];
    return {
        windowStart: r.window_start,
        windowEnd: r.window_end,
        actual: r.actual ?? [],
        forecast: r.forecast ?? [],
    };
}
async function getThisMonthTotals(moduleId) {
    const params = [];
    const whereModuleActual = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND module_id = $${params.length}`)
        : "";
    const whereModuleForecast = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND f.module_id = $${params.length}`)
        : "";
    const q = `
    WITH bounds AS (
      SELECT
        date_trunc('month', now())::date AS m_start,
        (date_trunc('month', now())::date + interval '1 month')::date AS m_end
    ),
    actual AS (
      SELECT COALESCE(SUM(total_power), 0)::numeric(14,2) AS total
      FROM module_data_daily, bounds
      WHERE day >= bounds.m_start AND day < bounds.m_end
        ${whereModuleActual}
    ),
    latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_days f
      WHERE 1=1 ${whereModuleForecast}
    ),
    forecast_remaining AS (
      SELECT COALESCE(SUM(f.power), 0)::numeric(14,2) AS total
      FROM forecast_data_days f
      JOIN latest ON f.forecast_timestamp = latest.ft
      JOIN bounds ON true
      WHERE (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date
            >= date_trunc('day', now())::date
        AND (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date
            < bounds.m_end
        ${whereModuleForecast}
    )
    SELECT
      (SELECT total FROM actual) AS actual_this_month,
      (SELECT total FROM forecast_remaining) AS forecast_remaining_this_month
  `;
    const { rows } = await index_1.pool.query(q, params);
    const r = rows[0];
    const actualThisMonth = num(r.actual_this_month);
    const forecastRemainingThisMonth = num(r.forecast_remaining_this_month);
    return {
        actualThisMonth,
        forecastRemainingThisMonth,
        forecastFullMonthEstimate: actualThisMonth + forecastRemainingThisMonth,
    };
}
async function getForecastHours24_Limit(moduleId) {
    const params = [];
    const whereModule = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND f.module_id = $${params.length}`)
        : "";
    const q = `
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_hours f
      WHERE 1=1 ${whereModule}
    )
    SELECT
      (date_trunc('hour', latest.ft) + (f.hour || ' hour')::interval) AS bucket_start,
      SUM(f.power)::numeric(14,2) AS total_power
    FROM forecast_data_hours f
    JOIN latest ON f.forecast_timestamp = latest.ft
    WHERE 1=1 ${whereModule}
    GROUP BY 1
    ORDER BY bucket_start ASC
    LIMIT 24;
  `;
    const { rows } = await index_1.pool.query(q, params);
    return rows; // [{bucket_start, total_power}, ...]
}
async function getForecastDays7_Limit(moduleId) {
    const params = [];
    const whereModule = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND f.module_id = $${params.length}`)
        : "";
    const q = `
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_days f
      WHERE 1=1 ${whereModule}
    )
    SELECT
      (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date AS bucket_start,
      SUM(f.power)::numeric(14,2) AS total_power
    FROM forecast_data_days f
    JOIN latest ON f.forecast_timestamp = latest.ft
    WHERE 1=1 ${whereModule}
    GROUP BY 1
    ORDER BY bucket_start ASC
    LIMIT 7;
  `;
    const { rows } = await index_1.pool.query(q, params);
    return rows;
}
async function getForecastDays30_Limit(moduleId) {
    const params = [];
    const whereModule = Number.isFinite(moduleId)
        ? (params.push(moduleId), `AND f.module_id = $${params.length}`)
        : "";
    const q = `
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_days f
      WHERE 1=1 ${whereModule}
    )
    SELECT
      (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::date AS bucket_start,
      SUM(f.power)::numeric(14,2) AS total_power
    FROM forecast_data_days f
    JOIN latest ON f.forecast_timestamp = latest.ft
    WHERE 1=1 ${whereModule}
    GROUP BY 1
    ORDER BY bucket_start ASC
    LIMIT 30;
  `;
    const { rows } = await index_1.pool.query(q, params);
    return rows;
}
async function getActualHours24(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT
      hour_start AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_hourly
    WHERE module_id = $1
      AND hour_start >= date_trunc('hour', NOW()) - INTERVAL '23 hours'
      AND hour_start <= date_trunc('hour', NOW())
    GROUP BY hour_start
    ORDER BY hour_start ASC;
    `, [moduleId]);
    return rows;
}
async function getActualDays7(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT
      day::timestamp AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_daily
    WHERE module_id = $1
      AND day >= (CURRENT_DATE - INTERVAL '6 days')::date
      AND day <= CURRENT_DATE
    GROUP BY day
    ORDER BY day ASC;
    `, [moduleId]);
    return rows;
}
// last 30 days actual (daily rollup)
async function getActualDays30(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT
      day::timestamp AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_daily
    WHERE module_id = $1
      AND day >= (CURRENT_DATE - INTERVAL '29 days')::date
      AND day <= CURRENT_DATE
    GROUP BY day
    ORDER BY day ASC;
    `, [moduleId]);
    return rows;
}
async function getActualHours24_AllModules() {
    const { rows } = await index_1.pool.query(`
    SELECT
      hour_start AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('hour', NOW()) - INTERVAL '23 hours'
      AND hour_start <= date_trunc('hour', NOW())
    GROUP BY hour_start
    ORDER BY hour_start ASC;
  `);
    return rows;
}
async function getActualDays7_AllModules() {
    const { rows } = await index_1.pool.query(`
    SELECT
      day::timestamp AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_daily
    WHERE day >= (CURRENT_DATE - INTERVAL '6 days')::date
      AND day <= CURRENT_DATE
    GROUP BY day
    ORDER BY day ASC;
  `);
    return rows;
}
async function getActualDays30_AllModules() {
    const { rows } = await index_1.pool.query(`
    SELECT
      day::timestamp AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_daily
    WHERE day >= (CURRENT_DATE - INTERVAL '29 days')::date
      AND day <= CURRENT_DATE
    GROUP BY day
    ORDER BY day ASC;
  `);
    return rows;
}
async function getForecastHours24_AllModules() {
    const { rows } = await index_1.pool.query(`
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_hours
    )
    SELECT
      (date_trunc('hour', latest.ft) + (f.hour || ' hours')::interval) AS bucket_start,
      SUM(f.power)::numeric(14,2) AS total_power
    FROM forecast_data_hours f
    JOIN latest ON f.forecast_timestamp = latest.ft
    GROUP BY 1
    ORDER BY bucket_start ASC
    LIMIT 24;
  `);
    return rows;
}
async function getForecastDays7_AllModules() {
    const { rows } = await index_1.pool.query(`
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_days
    )
    SELECT
      (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::timestamp AS bucket_start,
      SUM(f.power)::numeric(14,2) AS total_power
    FROM forecast_data_days f
    JOIN latest ON f.forecast_timestamp = latest.ft
    GROUP BY 1
    ORDER BY bucket_start ASC
    LIMIT 7;
  `);
    return rows;
}
async function getForecastDays30_AllModules() {
    const { rows } = await index_1.pool.query(`
    WITH latest AS (
      SELECT MAX(forecast_timestamp) AS ft
      FROM forecast_data_days
    )
    SELECT
      (date_trunc('day', latest.ft)::date + (f.day || ' days')::interval)::timestamp AS bucket_start,
      SUM(f.power)::numeric(14,2) AS total_power
    FROM forecast_data_days f
    JOIN latest ON f.forecast_timestamp = latest.ft
    GROUP BY 1
    ORDER BY bucket_start ASC
    LIMIT 30;
  `);
    return rows;
}
async function setLastOnNow(moduleId) {
    await index_1.pool.query(`
    UPDATE switching_data
    SET status = TRUE, last_on = NOW()
    WHERE module_id = $1;
  `, [moduleId]);
}
async function setLastOffNow(moduleId) {
    await index_1.pool.query(`
    UPDATE switching_data
    SET status = FALSE, last_off = NOW()
    WHERE module_id = $1;
  `, [moduleId]);
}
async function setStatusChange(moduleId, status) {
    await index_1.pool.query(`
    UPDATE switching_data
    SET statuschanged = $2
    WHERE module_id = $1;
  `, [moduleId, status]);
}
async function getStatusChange(moduleId) {
    const { rows } = await index_1.pool.query(`
    SELECT statuschanged
    FROM switching_data
    WHERE module_id = $1;
  `, [moduleId]);
    return rows[0]?.statuschanged;
}
//# sourceMappingURL=dbUtility.js.map