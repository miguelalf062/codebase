/**
 * HOURLY forecast
 * - input: last 300 minutes (minute table)
 * - output: forecast_data_hours with hour step = 0..N-1 (N should be 48)
 */
export declare function runHourlyForecast(): Promise<void>;
/**
 * DAILY forecast (next 7 days typically, depends on your Python output length)
 * - input: last 140 hours (hourly table)
 * - output: forecast_data_days with day step = 0..N-1
 */
export declare function runDailyForecast(): Promise<void>;
/**
 * MONTHLY forecast (your UI wants 30 days — this assumes your Python "monthly" returns ~30 points)
 * - input: last 61 days (daily table)
 * - output: forecast_data_months with month step = 0..N-1 (it's really "day steps" in your design, but stored in months table)
 *
 * NOTE: Your DB naming is confusing: forecast_data_months uses column "month" but you're using it like an index.
 * That's fine; just treat it as step index.
 */
export declare function runMonthlyForecast(): Promise<void>;
/**
 * YEARLY forecast (usually next 12 months)
 * - input: last 24 months (monthly table)
 * - output: forecast_data_years with year step = 0..N-1 (again: step index)
 */
export declare function runYearlyForecast(): Promise<void>;
//# sourceMappingURL=forecasting2.d.ts.map