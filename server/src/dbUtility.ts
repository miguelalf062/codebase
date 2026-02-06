import { timeStamp } from "console";
import { pool } from "./db/index";

export async function readModulesData() {
  const res = await pool.query("SELECT * FROM modules");
  return res.rows;
}

export async function getModuleIds(): Promise<number[]> {
  const { rows } = await pool.query<{ id: number }>(`SELECT id FROM modules ORDER BY id ASC;`);
  return rows.map((r) => r.id);
}

export async function readMinutesData() {
  const res = await pool.query("SELECT * FROM module_data_minute");
  return res.rows;
}

export async function readHoursData() {
  const res = await pool.query("SELECT * FROM module_data_hourly");
    return res.rows;

}

export async function readDailyData() {
  const res = await pool.query("SELECT * FROM module_data_daily");
    return res.rows;
}

export async function readWeeklyData() {
  const res = await pool.query("SELECT * FROM module_data_weekly")
  return res.rows;
}

export async function readMonthlyData() {
  const res = await pool.query("SELECT * FROM module_data_monthly");
    return res.rows;
}

export async function readYearlyData() {
  const res = await pool.query("SELECT * FROM module_data_yearly");
    return res.rows;
}

export async function writeMinutesData(moduleID: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO module_data_minute(module_id, current, voltage, power) VALUES(${moduleID}, ${current}, ${voltage}, ${power});`);
    return res;
}

export async function writeHourlyData(moduleID: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO module_data_minute(module_id, current, voltage, power) VALUES(${moduleID}, ${current}, ${voltage}, ${power});`);
    return res;
}

export async function writeDailyData(moduleID: number, day: Date, avg_current: number, avg_voltage: number, total_power: number) {
  const res = await pool.query(`INSERT INTO module_data_daily(module_id, day, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${day}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}

export async function writeWeeklyData(moduleID: number, week_start: Date, avg_current: number, avg_voltage: number, total_power: number) {
  const res = await pool.query(`INSERT INTO module_data_weekly(module_id, week_start, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${week_start}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}

export async function writeMonthlyData(moduleID: number, month_start: Date, avg_current: number, avg_voltage: number, total_power: number) {
  const res = await pool.query(`INSERT INTO module_data_weekly(module_id, month_start, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${month_start}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}

export async function writeYearlyData(moduleID: number, year_start: Date, avg_current: number, avg_voltage: number, total_power: number) {
  const res = await pool.query(`INSERT INTO module_data_weekly(module_id, year_start, avg_current, avg_voltage, total_power) VALUES(${moduleID}, ${year_start}, ${avg_current}, ${avg_voltage}, ${total_power});`);
    return res;
}

export async function writeForecastMinutesData(moduleID: number, minute: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_minutes(module_id, minute, current, voltage, power) VALUES(${moduleID}, ${minute}, ${current}, ${voltage}, ${power});`);
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
export async function writeForecastWeeksData(moduleID: number, week: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_weeks(module_id, week, current, voltage, power) VALUES(${moduleID}, ${week}, ${current}, ${voltage}, ${power});`);
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

export async function writeForecastHoursData(
  moduleID: number,
  hour: number,
  current: number,
  voltage: number,
  power: number
) {
  return pool.query(
    `
    INSERT INTO forecast_data_hours(module_id, hour, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `,
    [moduleID, hour, current, voltage, power]
  );
}

export async function writeForecastDaysData(
  moduleID: number,
  day: number,
  current: number,
  voltage: number,
  power: number
) {
  return pool.query(
    `
    INSERT INTO forecast_data_days(module_id, day, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `,
    [moduleID, day, current, voltage, power]
  );
}

export async function writeForecastMonthsData(
  moduleID: number,
  month: number,
  current: number,
  voltage: number,
  power: number
) {
  return pool.query(
    `
    INSERT INTO forecast_data_months(module_id, month, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `,
    [moduleID, month, current, voltage, power]
  );
}

export async function writeForecastYearsData(
  moduleID: number,
  year: number,
  current: number,
  voltage: number,
  power: number
) {
  return pool.query(
    `
    INSERT INTO forecast_data_years(module_id, year, current, voltage, power, forecast_timestamp)
    VALUES ($1, $2, $3, $4, $5, NOW());
    `,
    [moduleID, year, current, voltage, power]
  );
}

export async function deleteForecastHoursData() {
  const res = await pool.query(`DELETE FROM forecast_data_hours`);
  return res;
}

export async function deleteForecastDaysData() {
  const res = await pool.query(`DELETE FROM forecast_data_days`);
  return res;
}

export async function deleteForecastWeeksData() {
  const res = await pool.query(`DELETE FROM forecast_data_weeks`);
  return res;
}

export async function deleteForecastMonthsData() {
  const res = await pool.query(`DELETE FROM forecast_data_hours`);
  return res;
}

export async function deleteForecastYearsData() {
  const res = await pool.query(`DELETE FROM forecast_data_yearss`);
  return res;
}


export async function rollupHours() {
  await pool.query(`
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
      ROUND(SUM(power), 2) AS total_power
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
export async function rollupDays() {
  await pool.query(`
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
    FROM module_data_minute
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
export async function rollupWeeks() {
  await pool.query(`
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
    FROM module_data_minute
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
export async function rollupMonths() {
  await pool.query(`
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
    FROM module_data_minute
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
export async function rollupYears() {
  await pool.query(`
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
    FROM module_data_minute
    WHERE timestamp < date_trunc('year', NOW()) -- completed years only
    GROUP BY module_id, year_start
    ON CONFLICT (module_id, year_start)
    DO UPDATE SET
      avg_current = EXCLUDED.avg_current,
      avg_voltage = EXCLUDED.avg_voltage,
      total_power = EXCLUDED.total_power;
  `);
}

type Unit = "hour" | "day" | "week" | "month" | "year";

export async function shouldRun(jobName: string, unit: Unit): Promise<{ run: boolean; bucketStart: string }> {
  const result = await pool.query<{ run: boolean; latest_done: string }>(
    `
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
    `,
    [unit, jobName]
  );

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

export async function markRan(jobName: string, bucketStart: string) {
  await pool.query(
    `
    INSERT INTO prediction_runs (job_name, last_bucket_start)
    VALUES ($1, $2::timestamptz)
    ON CONFLICT (job_name)
    DO UPDATE SET last_bucket_start = EXCLUDED.last_bucket_start;
    `,
    [jobName, bucketStart]
  );
}

export async function fillMissingMinutesWithZeros() {
  await pool.query(`
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

export type MinuteRow = {
  module_id: number;
  current: string;   // pg numeric comes back as string unless you set parsers
  voltage: string;
  power: string;
  timestamp: string; // timestamptz -> string in JS
};

export type HourlyRow = {
  module_id: number;
  hour_start: string;   // timestamp/timestamptz -> string
  avg_current: string;
  avg_voltage: string;
  total_power: string;
};

export type DailyRow = {
  module_id: number;
  day: string;          // date -> string (YYYY-MM-DD)
  avg_current: string;
  avg_voltage: string;
  total_power: string;
};

export type WeeklyRow = {
  module_id: number;
  week_start: string;   // date -> string
  avg_current: string;
  avg_voltage: string;
  total_power: string;
};

export type MonthlyRow = {
  module_id: number;
  month_start: string;  // date -> string
  avg_current: string;
  avg_voltage: string;
  total_power: string;
};

export type YearlyRow = {
  module_id: number;
  year_start: string;   // date -> string
  avg_current: string;
  avg_voltage: string;
  total_power: string;
};
export async function getLastUploadedMinuteData(moduleId: string) {
  const { rows } = await pool.query<MinuteRow>(
    `
    SELECT module_id, current, voltage, power, timestamp
    FROM module_data_minute
    WHERE module_id = $1
    ORDER BY timestamp DESC
    LIMIT 1;
    `,
    [moduleId]
  );

  return rows[0] ?? null;
}


export async function getLast300Minutes(moduleId: number): Promise<MinuteRow[]> {
  const { rows } = await pool.query<MinuteRow>(
    `
    SELECT module_id, current, voltage, power, "timestamp" AS timestamp
    FROM module_data_minute
    WHERE module_id = $1
    ORDER BY "timestamp" DESC
    LIMIT 300;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getLast140Hours(moduleId: number): Promise<HourlyRow[]> {
  const { rows } = await pool.query<HourlyRow>(
    `
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE module_id = $1
    ORDER BY hour_start DESC
    LIMIT 140;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getTodayHourlyData() {
  const { rows } = await pool.query<HourlyRow>(
    `
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('day', NOW())
      AND hour_start <  date_trunc('day', NOW()) + INTERVAL '1 day'
    ORDER BY hour_start ASC;
    `
  );
  return rows;
}

export async function getYesterdayDailyData() {
  const { rows } = await pool.query<DailyRow>(
    `
    SELECT module_id, day, avg_current, avg_voltage, total_power
    FROM module_data_daily
    WHERE day = date_trunc('day', NOW()) - INTERVAL '1 day'
    ORDER BY module_id;
    `
  );

  return rows;
}

export async function getThisWeekData() {
  const { rows } = await pool.query(
    `
    SELECT module_id, week_start, avg_current, avg_voltage, total_power
    FROM module_data_weekly
    WHERE week_start >= date_trunc('week', NOW())
      AND week_start <  date_trunc('week', NOW()) + INTERVAL '1 week'
    ORDER BY week_start ASC;
    `
  );
  return rows;
}

export async function getThisWeekHourlyData() {
  const { rows } = await pool.query<HourlyRow>(
    `
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('week', NOW())
      AND hour_start <  date_trunc('week', NOW()) + INTERVAL '1 week'
    ORDER BY hour_start ASC;
    `
  );

  return rows;
}

export async function getThisMonthHourlyData() {
  const { rows } = await pool.query<HourlyRow>(
    `
    SELECT module_id, hour_start, avg_current, avg_voltage, total_power
    FROM module_data_hourly
    WHERE hour_start >= date_trunc('month', NOW())
      AND hour_start <  date_trunc('month', NOW()) + INTERVAL '1 month'
    ORDER BY hour_start ASC;
    `
  );

  return rows;
}

export async function getThisMonthData() {
  const { rows } = await pool.query(
    `
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE month_start >= date_trunc('month', NOW())
      AND month_start <  date_trunc('month', NOW()) + INTERVAL '1 month'
    ORDER BY month_start ASC;
    `
  );
  return rows;
}

export async function getLastMonthData() {
  const { rows } = await pool.query<MonthlyRow>(
    `
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE month_start >= date_trunc('month', NOW()) - INTERVAL '1 month'
      AND month_start <  date_trunc('month', NOW())
    ORDER BY module_id;
    `
  );

  return rows;
}

export async function getLast14Weeks(moduleId: number): Promise<WeeklyRow[]> {
  const { rows } = await pool.query<WeeklyRow>(
    `
    SELECT module_id, week_start, avg_current, avg_voltage, total_power
    FROM module_data_weekly
    WHERE module_id = $1
    ORDER BY week_start DESC
    LIMIT 14;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getLast61Days(moduleId: number) {
  const { rows } = await pool.query<{
    module_id: number;
    day: string;          // DATE -> 'YYYY-MM-DD'
    avg_current: string;
    avg_voltage: string;
    total_power: string;
  }>(
    `
    SELECT module_id, day, avg_current, avg_voltage, total_power
    FROM module_data_daily
    WHERE module_id = $1
    ORDER BY day DESC
    LIMIT 61;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getLast14Days(moduleId: number) {
  const { rows } = await pool.query<{
    module_id: number;
    day: string;          // DATE -> 'YYYY-MM-DD'
    avg_current: string;
    avg_voltage: string;
    total_power: string;
  }>(
    `
    SELECT module_id, day, avg_current, avg_voltage, total_power
    FROM module_data_daily
    WHERE module_id = $1
    ORDER BY day DESC
    LIMIT 14;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getLast61Months(moduleId: number): Promise<MonthlyRow[]> {
  const { rows } = await pool.query<MonthlyRow>(
    `
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE module_id = $1
    ORDER BY month_start DESC
    LIMIT 61;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getLast24Months(moduleId: number): Promise<MonthlyRow[]> {
  const { rows } = await pool.query<MonthlyRow>(
    `
    SELECT module_id, month_start, avg_current, avg_voltage, total_power
    FROM module_data_monthly
    WHERE module_id = $1
    ORDER BY month_start DESC
    LIMIT 24;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getLast24Years(moduleId: number): Promise<YearlyRow[]> {
  const { rows } = await pool.query<YearlyRow>(
    `
    SELECT module_id, year_start, avg_current, avg_voltage, total_power
    FROM module_data_yearly
    WHERE module_id = $1
    ORDER BY year_start DESC
    LIMIT 24;
    `,
    [moduleId]
  );

  return rows.reverse();
}

export async function getForecastWindows(moduleId: number) {
  const [minutes300, hours140, weeks14, months61, years24] = await Promise.all([
    getLast300Minutes(moduleId),
    getLast140Hours(moduleId),
    getLast14Weeks(moduleId),
    getLast61Months(moduleId),
    getLast24Years(moduleId),
  ]);

  return { minutes300, hours140, weeks14, months61, years24 };
}

export async function getForecastedMinutes() {
  const res = await pool.query("SELECT * FROM forecast_data_minutes");
  return res.rows;
}

export async function getForecastedHours() {
  const res = await pool.query("SELECT * FROM forecast_data_hours");
  return res.rows;
}

export async function getForecastedDays() {
  const res = await pool.query("SELECT * FROM forecast_data_days");
  return res.rows;
}

export async function getForecastedWeeks() {
  const res = await pool.query("SELECT * FROM forecast_data_weeks");
  return res.rows;
}

export async function getForecastedMonths() {
  const res = await pool.query("SELECT * FROM forecast_data_months");
  return res.rows;
}

export async function getForecastedYears() {
  const res = await pool.query("SELECT * FROM forecast_data_years");
  return res.rows;
}

export async function getModuleStatus(module_id : number) { 
  const res = await pool.query(`SELECT * FROM switching_data WHERE module_id=${module_id}`)
  return res.rows[0];
}

export async function setModuleStatus(module_id: number, status: boolean) {
  if (status) {
    await pool.query(`UPDATE switching_data SET status=TRUE, last_on=now() WHERE module_id=${module_id}`);
  } else {
    await pool.query(`UPDATE switching_data SET status=FALSE, last_off=now() WHERE module_id=${module_id}`);
  }
}

export async function getModuleName(module_id : number) { 
  const res = await pool.query(`SELECT * FROM naming_data WHERE module_id=${module_id}`)
  return res.rows[0];
}

export async function setModuleName(module_id : number, newName : string) {
  await pool.query(`UPDATE naming_data SET past_module = module_name WHERE module_id=${module_id}`).then(async data => {
    await pool.query(`UPDATE naming_data SET module_name = ${newName} WHERE module_id=${module_id}`)
  })
}

type DashboardModuleRow = {
  module_id: number;
  module_name: string | null;
  status: boolean | null;
  current: string | number | null;
  voltage: string | number | null;
  power: string | number | null;
  timestamp: string;
};

export async function getDashboardModules() {
  const { rows } = await pool.query<DashboardModuleRow>(`
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

export type Dataset = { day: string; value: number };

export type DashboardTotals = {
  last30DaysTotal: Dataset[];
  highestUsageMonth: { month: string; value: number } | null;
  lowestUsageMonth: { month: string; value: number } | null;
  avgPerDay: number;
  avgPerMonth: number;
  lastMonthTotal: number;
  thisMonthTotal: number;
};

export type ModuleFrontendPack = {
  module_id: number;
  deviceName: string;

  dailyPowerConsumption: Dataset[];   // 24 points (hours)
  monthlyPowerConsumption: Dataset[]; // 30 points (days)
  yearlyPowerConsumption: Dataset[];  // 12 points (months)

  deviceLastOn: string | null;
  isCurrentlyOn: boolean;
  deviceCurrentActiveTimeSec: number;
};

function toNumber(x: any) {
  return x == null ? 0 : Number(x);
}

export async function getDashboardTotals(): Promise<DashboardTotals> {
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

  const { rows } = await pool.query(q);
  const r = rows[0];

  return {
    last30DaysTotal: (r.last30 ?? []) as Dataset[],
    highestUsageMonth: r.highest ?? null,
    lowestUsageMonth: r.lowest ?? null,
    avgPerDay: toNumber(r.avg_day),
    avgPerMonth: toNumber(r.avg_month),
    lastMonthTotal: toNumber(r.last_month_total),
    thisMonthTotal: toNumber(r.this_month_total),
  };
}

export async function getModuleLast24Hours(moduleId: number): Promise<Dataset[]> {
  const { rows } = await pool.query(
    `
    SELECT
      to_char(hour_start, 'MM-DD HH24:00') AS day,
      COALESCE(total_power, 0)::numeric(14,2) AS value
    FROM module_data_hourly
    WHERE module_id = $1
      AND hour_start >= (date_trunc('hour', now()) - interval '23 hours')
    ORDER BY hour_start ASC;
    `,
    [moduleId]
  );

  return rows.map((r) => ({ day: r.day, value: toNumber(r.value) }));
}

export async function getModuleLast30Days(moduleId: number): Promise<Dataset[]> {
  const { rows } = await pool.query(
    `
    SELECT
      to_char(day::date, 'YYYY-MM-DD') AS day,
      COALESCE(total_power, 0)::numeric(14,2) AS value
    FROM module_data_daily
    WHERE module_id = $1
      AND day >= (date_trunc('day', now())::date - interval '29 days')
    ORDER BY day ASC;
    `,
    [moduleId]
  );

  return rows.map((r) => ({ day: r.day, value: toNumber(r.value) }));
}

export async function getModuleLast12Months(moduleId: number): Promise<Dataset[]> {
  const { rows } = await pool.query(
    `
    SELECT
      to_char(month_start::date, 'YYYY-MM') AS day,
      COALESCE(total_power, 0)::numeric(14,2) AS value
    FROM module_data_monthly
    WHERE module_id = $1
      AND month_start >= (date_trunc('month', now())::date - interval '11 months')
    ORDER BY month_start ASC;
    `,
    [moduleId]
  );

  return rows.map((r) => ({ day: r.day, value: toNumber(r.value) }));
}

export async function getModuleLiveStatus(moduleId: number): Promise<{
  deviceLastOn: string | null;
  isCurrentlyOn: boolean;
  deviceCurrentActiveTimeSec: number;
}> {
  const { rows } = await pool.query(
    `
    SELECT module_id, status, last_on, last_off
    FROM switching_data
    WHERE module_id = $1
    LIMIT 1;
    `,
    [moduleId]
  );

  const r = rows[0];
  if (!r) {
    return { deviceLastOn: null, isCurrentlyOn: false, deviceCurrentActiveTimeSec: 0 };
  }

  // If status=TRUE, active time = now - last_on. Else 0.
  const activeRes = await pool.query(
    `
    SELECT
      CASE
        WHEN $2::boolean = true AND $1::timestamptz IS NOT NULL
        THEN EXTRACT(EPOCH FROM (now() - $1::timestamptz))::bigint
        ELSE 0
      END AS active_sec
    `,
    [r.last_on, r.status]
  );

  return {
    deviceLastOn: r.last_on ? new Date(r.last_on).toISOString() : null,
    isCurrentlyOn: Boolean(r.status),
    deviceCurrentActiveTimeSec: Number(activeRes.rows[0]?.active_sec ?? 0),
  };
}
export async function getDashboardFrontendData(): Promise<{
  totals: DashboardTotals;
  modules: ModuleFrontendPack[];
}> {
  const totals = await getDashboardTotals();

  const { rows: mods } = await pool.query<{ id: number; name: string }>(
    `SELECT id, name FROM modules ORDER BY id ASC;`
  );

  const modules = await Promise.all(
    mods.map(async (m) => {
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
    })
  );

  return { totals, modules };
}

export async function getRemainingForecastHoursForToday(moduleId: number) {
  const { rows } = await pool.query(
    `
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
    `,
    [moduleId]
  );

  return rows;
}

export async function getTodayActualHours(moduleId: number) {
  const { rows } = await pool.query(
    `
    SELECT module_id, hour_start, total_power
    FROM module_data_hourly
    WHERE module_id = $1
      AND hour_start >= date_trunc('day', now())
      AND hour_start <  date_trunc('day', now()) + interval '1 day'
    ORDER BY hour_start ASC;
    `,
    [moduleId]
  );

  return rows;
}

export async function getTodayActualAndRemainingForecast(moduleId: number) {
  const [actual, forecast] = await Promise.all([
    getTodayActualHours(moduleId),
    getRemainingForecastHoursForToday(moduleId),
  ]);

  const boundaryHourStart = actual.length ? actual[actual.length - 1].hour_start : null;

  return { moduleId, boundaryHourStart, actual, forecast };
}

type SeriesPoint = { bucket_start: string; total_power: string };

function num(x: any) {
  return x == null ? 0 : Number(x);
}


export async function getForecastHours24(moduleId?: number) {
  const params: any[] = [];

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

  // if moduleId is used in actual clause too, push it once more:
  if (Number.isFinite(moduleId)) params.push(moduleId);

  const { rows } = await pool.query(q, params);
  const r = rows[0];

  return {
    forecastTimestamp: r.forecast_timestamp,
    actual: r.actual ?? [],
    forecast: r.forecast ?? [],
  };
}
export async function getForecastDaysWindow(
  daysAhead: 7 | 30,
  moduleId?: number
) {
  const params: any[] = [daysAhead];

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

  const { rows } = await pool.query(q, params);
  const r = rows[0];

  return {
    windowStart: r.window_start,
    windowEnd: r.window_end,
    actual: r.actual ?? [],
    forecast: r.forecast ?? [],
  };
}
export async function getThisMonthTotals(moduleId?: number) {
  const params: any[] = [];

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

  const { rows } = await pool.query(q, params);
  const r = rows[0];

  const actualThisMonth = num(r.actual_this_month);
  const forecastRemainingThisMonth = num(r.forecast_remaining_this_month);

  return {
    actualThisMonth,
    forecastRemainingThisMonth,
    forecastFullMonthEstimate:
      actualThisMonth + forecastRemainingThisMonth,
  };
}

export async function getForecastHours24_Limit(moduleId?: number) {
  const params: any[] = [];

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

  const { rows } = await pool.query(q, params);
  return rows; // [{bucket_start, total_power}, ...]
}

export async function getForecastDays7_Limit(moduleId?: number) {
  const params: any[] = [];

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

  const { rows } = await pool.query(q, params);
  return rows;
}

export async function getForecastDays30_Limit(moduleId?: number) {
  const params: any[] = [];

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

  const { rows } = await pool.query(q, params);
  return rows;
}
export async function getActualHours24(moduleId: number) {
  const { rows } = await pool.query<{
    bucket_start: string;
    total_power: string;
  }>(
    `
    SELECT
      hour_start AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_hourly
    WHERE module_id = $1
      AND hour_start >= date_trunc('hour', NOW()) - INTERVAL '23 hours'
      AND hour_start <= date_trunc('hour', NOW())
    GROUP BY hour_start
    ORDER BY hour_start ASC;
    `,
    [moduleId]
  );

  return rows;
}

export async function getActualDays7(moduleId: number) {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(
    `
    SELECT
      day::timestamp AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_daily
    WHERE module_id = $1
      AND day >= (CURRENT_DATE - INTERVAL '6 days')::date
      AND day <= CURRENT_DATE
    GROUP BY day
    ORDER BY day ASC;
    `,
    [moduleId]
  );
  return rows;
}

// last 30 days actual (daily rollup)
export async function getActualDays30(moduleId: number) {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(
    `
    SELECT
      day::timestamp AS bucket_start,
      SUM(total_power)::numeric(14,2) AS total_power
    FROM module_data_daily
    WHERE module_id = $1
      AND day >= (CURRENT_DATE - INTERVAL '29 days')::date
      AND day <= CURRENT_DATE
    GROUP BY day
    ORDER BY day ASC;
    `,
    [moduleId]
  );
  return rows;
}

export async function getActualHours24_AllModules() {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(`
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

export async function getActualDays7_AllModules() {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(`
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

export async function getActualDays30_AllModules() {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(`
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

export async function getForecastHours24_AllModules() {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(`
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

export async function getForecastDays7_AllModules() {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(`
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

export async function getForecastDays30_AllModules() {
  const { rows } = await pool.query<{ bucket_start: string; total_power: string }>(`
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