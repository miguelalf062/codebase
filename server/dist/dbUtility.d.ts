export declare function readModulesData(): Promise<any[]>;
export declare function getModuleIds(): Promise<number[]>;
export declare function readMinutesData(): Promise<any[]>;
export declare function readHoursData(): Promise<any[]>;
export declare function readDailyData(): Promise<any[]>;
export declare function readWeeklyData(): Promise<any[]>;
export declare function readMonthlyData(): Promise<any[]>;
export declare function readYearlyData(): Promise<any[]>;
export declare function writeMinutesData(moduleID: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeHourlyData(moduleID: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeDailyData(moduleID: number, day: Date, avg_current: number, avg_voltage: number, total_power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeWeeklyData(moduleID: number, week_start: Date, avg_current: number, avg_voltage: number, total_power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeMonthlyData(moduleID: number, month_start: Date, avg_current: number, avg_voltage: number, total_power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeYearlyData(moduleID: number, year_start: Date, avg_current: number, avg_voltage: number, total_power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeForecastMinutesData(moduleID: number, minute: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeForecastWeeksData(moduleID: number, week: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeForecastHoursData(moduleID: number, hour: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeForecastDaysData(moduleID: number, day: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeForecastMonthsData(moduleID: number, month: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function writeForecastYearsData(moduleID: number, year: number, current: number, voltage: number, power: number): Promise<import("pg").QueryResult<any>>;
export declare function deleteForecastHoursData(): Promise<import("pg").QueryResult<any>>;
export declare function deleteForecastDaysData(): Promise<import("pg").QueryResult<any>>;
export declare function deleteForecastWeeksData(): Promise<import("pg").QueryResult<any>>;
export declare function deleteForecastMonthsData(): Promise<import("pg").QueryResult<any>>;
export declare function deleteForecastYearsData(): Promise<import("pg").QueryResult<any>>;
export declare function rollupHours(): Promise<void>;
/**
 * Daily rollup -> module_data_daily
 * PK: (module_id, day) date
 */
export declare function rollupDays(): Promise<void>;
/**
 * Weekly rollup -> module_data_weekly
 * PK: (module_id, week_start) date
 * Postgres week startimestamp Monday
 */
export declare function rollupWeeks(): Promise<void>;
/**
 * Monthly rollup -> module_data_monthly
 * PK: (module_id, month_start) date
 */
export declare function rollupMonths(): Promise<void>;
/**
 * Yearly rollup -> module_data_yearly
 * PK: (module_id, year_start) date
 */
export declare function rollupYears(): Promise<void>;
type Unit = "hour" | "day" | "week" | "month" | "year";
export declare function shouldRun(jobName: string, unit: Unit): Promise<{
    run: boolean;
    bucketStart: string;
}>;
export declare function markRan(jobName: string, bucketStart: string): Promise<void>;
export declare function fillMissingMinutesWithZeros(): Promise<void>;
export type MinuteRow = {
    module_id: number;
    current: string;
    voltage: string;
    power: string;
    timestamp: string;
};
export type HourlyRow = {
    module_id: number;
    hour_start: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
};
export type DailyRow = {
    module_id: number;
    day: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
};
export type WeeklyRow = {
    module_id: number;
    week_start: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
};
export type MonthlyRow = {
    module_id: number;
    month_start: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
};
export type YearlyRow = {
    module_id: number;
    year_start: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
};
export declare function getLastUploadedMinuteData(moduleId: string): Promise<MinuteRow | null>;
export declare function getLast300Minutes(moduleId: number): Promise<MinuteRow[]>;
export declare function getLast140Hours(moduleId: number): Promise<HourlyRow[]>;
export declare function getTodayHourlyData(): Promise<HourlyRow[]>;
export declare function getYesterdayDailyData(): Promise<DailyRow[]>;
export declare function getThisWeekData(): Promise<any[]>;
export declare function getThisWeekHourlyData(): Promise<HourlyRow[]>;
export declare function getThisMonthHourlyData(): Promise<HourlyRow[]>;
export declare function getThisMonthData(): Promise<any[]>;
export declare function getLastMonthData(): Promise<MonthlyRow[]>;
export declare function getLast14Weeks(moduleId: number): Promise<WeeklyRow[]>;
export declare function getLast61Days(moduleId: number): Promise<{
    module_id: number;
    day: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
}[]>;
export declare function getLast14Days(moduleId: number): Promise<{
    module_id: number;
    day: string;
    avg_current: string;
    avg_voltage: string;
    total_power: string;
}[]>;
export declare function getLast61Months(moduleId: number): Promise<MonthlyRow[]>;
export declare function getLast24Months(moduleId: number): Promise<MonthlyRow[]>;
export declare function getLast24Years(moduleId: number): Promise<YearlyRow[]>;
export declare function getForecastWindows(moduleId: number): Promise<{
    minutes300: MinuteRow[];
    hours140: HourlyRow[];
    weeks14: WeeklyRow[];
    months61: MonthlyRow[];
    years24: YearlyRow[];
}>;
export declare function getForecastedMinutes(): Promise<any[]>;
export declare function getForecastedHours(): Promise<any[]>;
export declare function getForecastedDays(): Promise<any[]>;
export declare function getForecastedWeeks(): Promise<any[]>;
export declare function getForecastedMonths(): Promise<any[]>;
export declare function getForecastedYears(): Promise<any[]>;
export declare function getAllModulesStatus(): Promise<any[]>;
export declare function getModuleStatus(module_id: number): Promise<any>;
export declare function setModuleStatus(module_id: number, status: boolean): Promise<void>;
export declare function getModuleName(module_id: number): Promise<any>;
export declare function setModuleName(module_id: number, newName: string): Promise<void>;
export declare function getDashboardModules(): Promise<{
    id: number;
    name: string;
    status: boolean;
    current: number;
    voltage: number;
    power: number;
    timeStamp: string;
}[]>;
export type Dataset = {
    day: string;
    value: number;
};
export type DashboardTotals = {
    last30DaysTotal: Dataset[];
    highestUsageMonth: {
        month: string;
        value: number;
    } | null;
    lowestUsageMonth: {
        month: string;
        value: number;
    } | null;
    avgPerDay: number;
    avgPerMonth: number;
    lastMonthTotal: number;
    thisMonthTotal: number;
};
export type ModuleFrontendPack = {
    module_id: number;
    deviceName: string;
    dailyPowerConsumption: Dataset[];
    monthlyPowerConsumption: Dataset[];
    yearlyPowerConsumption: Dataset[];
    deviceLastOn: string | null;
    isCurrentlyOn: boolean;
    deviceCurrentActiveTimeSec: number;
};
export declare function getDashboardTotals(): Promise<DashboardTotals>;
export declare function getModuleLast24Hours(moduleId: number): Promise<Dataset[]>;
export declare function getModuleLast30Days(moduleId: number): Promise<Dataset[]>;
export declare function getModuleLast12Months(moduleId: number): Promise<Dataset[]>;
export declare function getModuleLiveStatus(moduleId: number): Promise<{
    deviceLastOn: string | null;
    isCurrentlyOn: boolean;
    deviceCurrentActiveTimeSec: number;
}>;
export declare function getDashboardFrontendData(): Promise<{
    totals: DashboardTotals;
    modules: ModuleFrontendPack[];
}>;
export declare function getRemainingForecastHoursForToday(moduleId: number): Promise<any[]>;
export declare function getTodayActualHours(moduleId: number): Promise<any[]>;
export declare function getTodayActualAndRemainingForecast(moduleId: number): Promise<{
    moduleId: number;
    boundaryHourStart: any;
    actual: any[];
    forecast: any[];
}>;
export declare function getForecastHours24(moduleId?: number): Promise<{
    forecastTimestamp: any;
    actual: any;
    forecast: any;
}>;
export declare function getForecastDaysWindow(daysAhead: 7 | 30, moduleId?: number): Promise<{
    windowStart: any;
    windowEnd: any;
    actual: any;
    forecast: any;
}>;
export declare function getThisMonthTotals(moduleId?: number): Promise<{
    actualThisMonth: number;
    forecastRemainingThisMonth: number;
    forecastFullMonthEstimate: number;
}>;
export declare function getForecastHours24_Limit(moduleId?: number): Promise<any[]>;
export declare function getForecastDays7_Limit(moduleId?: number): Promise<any[]>;
export declare function getForecastDays30_Limit(moduleId?: number): Promise<any[]>;
export declare function getActualHours24(moduleId: number): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getActualDays7(moduleId: number): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getActualDays30(moduleId: number): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getActualHours24_AllModules(): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getActualDays7_AllModules(): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getActualDays30_AllModules(): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getForecastHours24_AllModules(): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getForecastDays7_AllModules(): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function getForecastDays30_AllModules(): Promise<{
    bucket_start: string;
    total_power: string;
}[]>;
export declare function setLastOnNow(moduleId: number): Promise<void>;
export declare function setLastOffNow(moduleId: number): Promise<void>;
export declare function setStatusChange(moduleId: number, status: boolean): Promise<void>;
export declare function getStatusChange(moduleId: number): Promise<any>;
export {};
//# sourceMappingURL=dbUtility.d.ts.map