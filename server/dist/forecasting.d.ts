type ForecastResult = {
    data: number[];
};
export declare function runForecastProcess(processMethod: string, data: number[]): Promise<ForecastResult>;
export declare function doRollups(): Promise<void>;
export declare function generateAmountMinutes(amount: number): Promise<void>;
export declare function startPredictionScheduler(): Promise<void>;
export {};
//# sourceMappingURL=forecasting.d.ts.map