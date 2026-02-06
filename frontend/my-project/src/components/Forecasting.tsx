import { useEffect, useState } from "react";
import ForecastGraph from "./ForecastGraph"
import ForecastReminder1 from "./ForecastReminder1";
import ForecastReminder2 from "./ForecastReminder2";
import ForecastingComsumptionComparison from "./ForecastingConsumptionComparison";
import ForecastComparison from "./ForecastComparison";


// get forecasting for 24 hrs (24 hours)
// get forecasting for 7 days (7 days)
// get forecasting for 1 month (30 days)

// get total power forecast consumption this month
// get total power actual pwoer consumption this month

//type hourlyDataPoint = {module_id: string; hour_start: string; avg_current: string; avg_voltage: string; total_power: string}
// type dataset = { day: string; value: number }[];

type datasetPoint = { day: string; value: number };
type dataset = datasetPoint[];

type ForecastRow = { bucket_start: string; total_power: string };

// type ForecastSingleResponse = { moduleId: number; forecast: ForecastRow[] };
// type ForecastByModuleResponse = { forecastByModule: Record<string, ForecastRow[]> };

type ForecastWindowResponse = {
  actual: ForecastRow[];
  forecast: ForecastRow[];
  splitIndex: number;
};

type MonthTotalsSingleResponse = {
  moduleId: number;
  actualThisMonth: number;
  forecastRemainingThisMonth: number;
  forecastFullMonthEstimate: number;
};

type MonthTotalsAllResponse = {
  totalsByModule: Record<string, {
    actualThisMonth: number;
    forecastRemainingThisMonth: number;
    forecastFullMonthEstimate: number;
  }>;
  totalsAllModules: {
    actualThisMonth: number;
    forecastRemainingThisMonth: number;
    forecastFullMonthEstimate: number;
  };
};



const DEFAULT_MODULE_ID = 1;

function formatHourLabel(iso: string) {
  return new Date(iso).toLocaleString("en-US", { hour: "numeric", hour12: true });
}

function formatDayLabel(isoOrDate: string) {
  const d = new Date(isoOrDate.length === 10 ? isoOrDate + "T00:00:00" : isoOrDate);
  return d.toLocaleString("en-US", { month: "short", day: "2-digit" });
}

function rowsToDataset(rows: ForecastRow[], mode: "hour" | "day"): dataset {
  return (rows ?? []).map((r) => ({
    day: mode === "hour" ? formatHourLabel(r.bucket_start) : formatDayLabel(r.bucket_start),
    value: Number(r.total_power),
  }));
}

// async function fetchForecastRows(url: string, moduleId?: number): Promise<ForecastRow[]> {
//   const fullUrl = moduleId ? `${url}?moduleId=${moduleId}` : url;
//   const json = await fetch(fullUrl).then((r) => r.json());

//   // Single module: { moduleId, forecast }
//   if (json && Array.isArray(json.forecast)) return json.forecast as ForecastRow[];

//   // All modules: { forecastByModule: { "1": [...], "2": [...] } }
//   if (json && json.forecastByModule && moduleId != null) {
//     return (json.forecastByModule[String(moduleId)] ?? []) as ForecastRow[];
//   }

//   return [];
// }

async function fetchForecastWindow(url: string): Promise<ForecastWindowResponse> {
  const json = await fetch(url).then((r) => r.json());
  return json as ForecastWindowResponse;
}

async function fetchMonthTotals(moduleId?: number) {
  const url = moduleId ? `/api/forecasting/monthTotals?moduleId=${moduleId}` : `/api/forecasting/monthTotals`;
  const json = await fetch(url).then((r) => r.json());
  return json as MonthTotalsSingleResponse | MonthTotalsAllResponse;
}


const Forecasting = () => {
  const [hours24, setHours24] = useState<{ realDataSet: dataset; forecastedDataSet: dataset }>({
    realDataSet: [],
    forecastedDataSet: [],
  });

  const [days7, setDays7] = useState<{ realDataSet: dataset; forecastedDataSet: dataset }>({
    realDataSet: [],
    forecastedDataSet: [],
  });

  const [days30, setDays30] = useState<{ realDataSet: dataset; forecastedDataSet: dataset }>({
    realDataSet: [],
    forecastedDataSet: [],
  });

  const [monthTotals, setMonthTotals] = useState<MonthTotalsSingleResponse | null>(null);
  const [, setError] = useState<string | null>(null);

  async function loadAll() {
    try {
      setError(null);

      const moduleId = DEFAULT_MODULE_ID;

      const [w24, w7, w30, totals] = await Promise.all([
        fetchForecastWindow("/api/forecasting/hours24"),
        fetchForecastWindow("/api/forecasting/days7"),
        fetchForecastWindow("/api/forecasting/days30"),
        fetchMonthTotals(DEFAULT_MODULE_ID), // or remove moduleId if you also want totals for all modules
      ]);

      setHours24({
        realDataSet: rowsToDataset(w24.actual, "hour"),
        forecastedDataSet: rowsToDataset(w24.forecast, "hour"),
      });

      setDays7({
        realDataSet: rowsToDataset(w7.actual, "day"),
        forecastedDataSet: rowsToDataset(w7.forecast, "day"),
      });

      setDays30({
        realDataSet: rowsToDataset(w30.actual, "day"),
        forecastedDataSet: rowsToDataset(w30.forecast, "day"),
      });

      // totals: if you asked moduleId, it should be single response
      if ("forecastFullMonthEstimate" in totals) {
        setMonthTotals(totals as MonthTotalsSingleResponse);
      } else {
        // fallback if server returns totalsAllModules (shouldn't happen if moduleId is passed)
        const all = totals as MonthTotalsAllResponse;
        const t = all.totalsByModule[String(moduleId)];
        if (t) {
          setMonthTotals({
            moduleId,
            ...t,
          });
        }
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Unknown error");
      setError(err.message);
    }
  }

  useEffect(() => {
  const t = setTimeout(() => {
    loadAll();
  }, 0);

  const interval = setInterval(loadAll, 60 * 60 * 1000);

  return () => {
    clearTimeout(t);
    clearInterval(interval);
  };
}, []);

  const forecastThisMonthTotal = monthTotals?.forecastFullMonthEstimate ?? 0;
  const actualThisMonthTotal = monthTotals?.actualThisMonth ?? 0;
  
  return (
    <div>
      <div className="mt-5">
        <ForecastGraph realDataSet={hours24.realDataSet} forecastedDataSet={hours24.forecastedDataSet} label="Forecasted Consumption" unitLabel="24 hrs"/>
      </div>
      <div className="mt-5">
        <ForecastGraph realDataSet={days7.realDataSet} forecastedDataSet={days7.forecastedDataSet}  label="Forecasted Consumption" unitLabel="7 days"/>
      </div>
      <div className="mt-5">
        <ForecastGraph realDataSet={days30.realDataSet} forecastedDataSet={days30.forecastedDataSet} label="Forecasted Consumption" unitLabel="1 month"/>
      </div>
      <div className="xl:flex ">
        <div className="flex-1 flex xl:justify-start justify-center xl:items-normal items-center h-[70vh]">
          <div className="w-[95%] xl:w-[95%] xl:ml-5">
            <ForecastReminder1 totalForecastConsumption={forecastThisMonthTotal}/>
            <ForecastReminder2 totalForecastConsumption={forecastThisMonthTotal} meralcoRate={13.47}/>
            <div className="scale-75 xl:mt-10 xl:scale-140 w-full h-full">
              <ForecastingComsumptionComparison currentConsumption={actualThisMonthTotal} yesterdayConsumption={forecastThisMonthTotal}/>
            </div>
          </div>
        </div>
        <div className="flex-1 h-[60vh] xl:h-[70vh] xl:mt-5 flex justify-center">
            <div className="xl:mt-5 xl:w-full flex justify-center">
              <ForecastComparison actualConsumption={actualThisMonthTotal} forecastedConsumption={forecastThisMonthTotal}/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Forecasting