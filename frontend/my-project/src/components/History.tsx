import DeviceHistory from "./DeviceHistory";
import MonthlyConsumptionComparison from "./MonthlyConsumptionComparison";
import PowerConsumptionGraph from "./PowerConsumptionGraph"
import HistoryInfo from "./HistoryInfo"
import HistoryInfo2 from "./HistoryInfo2";
import HistoryInfo3 from "./HistoryInfo3";
import DeviceHistoryMobile from "./DeviceHistoryMobile";
import { useEffect, useState } from "react";
type dataset = { day: string; value: number };

type DashboardTotals = {
  last30DaysTotal: dataset[];
  highestUsageMonth: { month: string; value: number } | null;
  lowestUsageMonth: { month: string; value: number } | null;
  avgPerDay: number;
  avgPerMonth: number;
  lastMonthTotal: number;
  thisMonthTotal: number;
};

type ModuleFrontendPack = {
  module_id: number;
  deviceName: string;

  dailyPowerConsumption: dataset[];
  monthlyPowerConsumption: dataset[];
  yearlyPowerConsumption: dataset[];

  deviceLastOn: string | null;
  isCurrentlyOn: boolean;
  deviceCurrentActiveTimeSec: number;
};

type DashboardData = {
  totals: DashboardTotals;
  modules: ModuleFrontendPack[];
};

type historyDeviceData = {
    deviceName: string;
    portId: number;
    dailyPowerConsumption: dataset[];
    monthlyPowerConsumption: dataset[];
    yearlyPowerConsumption: dataset[];
    deviceLastMonitored: string;
    deviceCurrentActiveTime: string;
    dailyAverageUsage: number;
    monthlyAverageUsage: number;
    yearlyAverageUsage: number;
} | null;


// NEEDED DATA
// 1 month power consumption in days
// highest usage month
// lowest usage month
// avg per day
// avg per month
// last month total consumption
// this month total consumption

// every device day,month,year consumption
// device last on
// current device active time
// http://localhost:3000/api/switching/1/status
//{"id":1,"module_id":1,"status":false,"last_on":"2026-02-13T21:56:34.274Z","last_off":"2026-02-13T21:57:50.065Z"}
export type deviceStatus = {
  id: number;
  module_id: number;
  status: boolean;
  last_on: string | null;
  last_off: string | null;
}
const History = () => {
  const [historyData, setHistoryData] = useState<DashboardData | null>(null);
  const [moduleActiveTime, setModuleActiveTime] = useState<deviceStatus []| null>(null);
  const [historyDeviceDataSet, setHistoryDeviceDataSet] = useState<historyDeviceData[] | null>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  async function fetchHistory() {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      setHistoryData(data);
      setError(null);

      setHistoryDeviceDataSet(data.modules.map((dataset: ModuleFrontendPack) => {
        return {
          deviceName: dataset.deviceName,
          portId: dataset.module_id,
          dailyPowerConsumption: dataset.dailyPowerConsumption,
          monthlyPowerConsumption: dataset.monthlyPowerConsumption,
          yearlyPowerConsumption: dataset.yearlyPowerConsumption,
          deviceLastMonitored: dataset.deviceLastOn || "Never",
          deviceCurrentActiveTime: `${dataset.deviceCurrentActiveTimeSec / 60} minutes`,
          dailyAverageUsage: dataset.dailyPowerConsumption.reduce((sum, d) => sum + d.value, 0) / dataset.dailyPowerConsumption.length || 0,
          weeklyAverageUsage: dataset.monthlyPowerConsumption.reduce((sum, d) => sum + d.value, 0) / dataset.monthlyPowerConsumption.length || 0,
          monthlyAverageUsage: dataset.yearlyPowerConsumption.reduce((sum, d) => sum + d.value, 0) / dataset.yearlyPowerConsumption.length || 0
        }
      }));
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Unknown error");
      setError(err.message);
      
    } finally {
      setLoading(false);
    }

  }

  async function fetchModulesActiveTime () {
    try {
      const res = await fetch("/api/switching/all");
      if (!res.ok) throw new Error("Failed to fetch modules active time");
      const data = await res.json();
      setModuleActiveTime(data);

    } catch (e) {
      const err = e instanceof Error ? e : new Error("Unknown error");
      setError(err.message);
    }
  }

  useEffect(() => {
    // 1) Fetch immediately when component mounts
    fetchHistory();
    fetchModulesActiveTime();
    // 2) Refresh at x time
    const interval = setInterval(fetchHistory, 60 * 60 * 1000);
    const interval2 = setInterval(fetchModulesActiveTime, 5 * 1000);
    // 3) Cleanup when component unmounts
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);
  console.log(historyData)

function yearMonthToText(ym: string) {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1);

  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}



  return (
    <div>
      <div className="h-full xl:flex">
        {/* FIRST COLUMN */}
        <div className="mt-5 xl:w-[65%] ">
          <PowerConsumptionGraph dashboardGraphData={historyData?.totals.last30DaysTotal || []} label="1 Month"/>
          <HistoryInfo currentAmount={historyData?.totals.highestUsageMonth?.value || 0} label1={yearMonthToText(historyData?.totals.highestUsageMonth?.month || "Unknown")} />
          <HistoryInfo2 currentAmount={historyData?.totals.lowestUsageMonth?.value || 0} label1={yearMonthToText(historyData?.totals.lowestUsageMonth?.month || "Unknown")} />
       
        </div>
        {/* SECOND COLUMN */}
        <div className="xl:w-[35%] xl:flex xl:items-center xl:mt-5 xl:flex-col">
          <div className="w-full h-[250px]"> 
            <MonthlyConsumptionComparison  currentConsumption={historyData?.totals.thisMonthTotal || 0} lastMonthConsumption={historyData?.totals.lastMonthTotal || 0}/>
          </div>
          <HistoryInfo3 currentAmount={historyData?.totals.avgPerDay || 0} label1="Avg. Per Day" />
          <HistoryInfo3 currentAmount={historyData?.totals.avgPerMonth || 0} label1="Avg. Per Month" />

        </div>
      </div>
      <div className="xl:mt-[300px] w-[full] h-[30vh] flex justify-center items-center">
            <div className="hidden xl:block w-full flex justify-center h-[850px]">
              <DeviceHistory historyDeviceDataSet={historyDeviceDataSet || []} deviceStatuses={moduleActiveTime || []} />
            </div>
            <div className="mt-[650px] block xl:hidden w-full flex justify-center h-[850px]">
              <DeviceHistoryMobile historyDeviceDataSet={historyDeviceDataSet || []} />
            </div>
      </div>
    </div>

  )
}

export default History