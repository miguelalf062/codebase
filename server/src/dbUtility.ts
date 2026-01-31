import { pool } from "./db/index";

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
export async function writeForecastHoursData(moduleID: number, hour: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_hours(module_id, hour, current, voltage, power) VALUES(${moduleID}, ${hour}, ${current}, ${voltage}, ${power});`);
    return res;
}
export async function writeForecastDaysData(moduleID: number, day: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_days(module_id, day, current, voltage, power) VALUES(${moduleID}, ${day}, ${current}, ${voltage}, ${power});`);
    return res;
}
export async function writeForecastWeeksData(moduleID: number, week: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_weeks(module_id, week, current, voltage, power) VALUES(${moduleID}, ${week}, ${current}, ${voltage}, ${power});`);
    return res;
}
export async function writeForecastMonthsData(moduleID: number, month: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_months(module_id, month, current, voltage, power) VALUES(${moduleID}, ${month}, ${current}, ${voltage}, ${power});`);
    return res;
}
export async function writeForecastYearsData(moduleID: number, year: number, current: number, voltage: number, power: number) {
  const res = await pool.query(`INSERT INTO forecast_data_years(module_id, year, current, voltage, power) VALUES(${moduleID}, ${year}, ${current}, ${voltage}, ${power});`);
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