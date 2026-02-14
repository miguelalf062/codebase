import { useState } from "react";
import DeviceHistoryGraph from "./DeviceHistoryGraph";
import type { deviceStatus } from "./History";

type dataset = { day: string; value: number };

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

// const rand = (min: number, max: number) =>
//   Math.round(min + Math.random() * (max - min));

// const genDaily = (): dataset[] =>
//   Array.from({ length: 24 }, (_, i) => ({
//     day: `H${i.toString().padStart(2, "0")}`,
//     value: rand(1, 5),
//   }));

// const genMonthly = (): dataset[] =>
//   Array.from({ length: 30 }, (_, i) => ({
//     day: `Day ${i + 1}`,
//     value: rand(40, 120),
//   }));

// const genYearly = (): dataset[] =>
//   [
//     "Jan","Feb","Mar","Apr","May","Jun",
//     "Jul","Aug","Sep","Oct","Nov","Dec"
//   ].map((m) => ({
//     day: m,
//     value: rand(900, 2500),
//   }));

// const now = new Date().toISOString();

// const dummyDataSet = [
//   {
//     deviceName: "Living Room AC",
//     portId: 1,
//     dailyPowerConsumption: genDaily(),
//     monthlyPowerConsumption: genMonthly(),
//     yearlyPowerConsumption: genYearly(),
//     deviceLastMonitored: "2024-01-10T08:00:00.000Z",
//     deviceCurrentActiveTime: now,
//     dailyAverageUsage: 3.2,
//     weeklyAverageUsage: 22.5,
//     monthlyAverageUsage: 95.4,
//   },
//   {
//     deviceName: "Refrigerator",
//     portId: 2,
//     dailyPowerConsumption: genDaily(),
//     monthlyPowerConsumption: genMonthly(),
//     yearlyPowerConsumption: genYearly(),
//     deviceLastMonitored: "2024-02-02T10:30:00.000Z",
//     deviceCurrentActiveTime: now,
//     dailyAverageUsage: 2.8,
//     weeklyAverageUsage: 19.1,
//     monthlyAverageUsage: 82.7,
//   },
//   {
//     deviceName: "Gaming PC",
//     portId: 3,
//     dailyPowerConsumption: genDaily(),
//     monthlyPowerConsumption: genMonthly(),
//     yearlyPowerConsumption: genYearly(),
//     deviceLastMonitored: "2024-03-15T19:00:00.000Z",
//     deviceCurrentActiveTime: now,
//     dailyAverageUsage: 4.6,
//     weeklyAverageUsage: 31.2,
//     monthlyAverageUsage: 130.5,
//   },
//   {
//     deviceName: "Electric Fan",
//     portId: 4,
//     dailyPowerConsumption: genDaily(),
//     monthlyPowerConsumption: genMonthly(),
//     yearlyPowerConsumption: genYearly(),
//     deviceLastMonitored: "2024-04-01T06:15:00.000Z",
//     deviceCurrentActiveTime: now,
//     dailyAverageUsage: 1.4,
//     weeklyAverageUsage: 9.8,
//     monthlyAverageUsage: 42.3,
//   },
//   {
//     deviceName: "Water Pump",
//     portId: 5,
//     dailyPowerConsumption: genDaily(),
//     monthlyPowerConsumption: genMonthly(),
//     yearlyPowerConsumption: genYearly(),
//     deviceLastMonitored: "2024-05-20T05:45:00.000Z",
//     deviceCurrentActiveTime: now,
//     dailyAverageUsage: 2.1,
//     weeklyAverageUsage: 14.7,
//     monthlyAverageUsage: 61.9,
//   },
//     ];

// export type deviceStatus = {
//   id: number;
//   module_id: number;
//   status: boolean;
//   last_on: string | null;
//   last_off: string | null;
// }

const DeviceHistory = ({historyDeviceDataSet, deviceStatuses} : {historyDeviceDataSet : historyDeviceData[], deviceStatuses: deviceStatus[]}) => {
    console.log("DEVICE STATUSES: ",deviceStatuses)
    

    const [deviceInfoShow, setDeviceInfoShow] = useState(false);
    const [currentDeviceData, setCurrentDeviceData] = useState<historyDeviceData>(null);

    function handleDeviceClick (data : historyDeviceData) {
        if (!data) return;
        setCurrentDeviceData(data);
        setDeviceInfoShow(true);
    }

    function findDeviceWithPortID(portId: number) : deviceStatus | undefined {
        const status = deviceStatuses.find(status => status.module_id === portId);
        return status
    }

    function getLastActiveTime(portId: number | undefined) {
        if (portId === undefined) return "Unknown";

        const deviceStatus = findDeviceWithPortID(portId);
        if (!deviceStatus) return "Unknown";
        const last_on = deviceStatus.last_on as string;
        const last_off = deviceStatus.last_off as string;
        const status = deviceStatus.status;
        
        
        if (status) {
            const diffMs = new Date(last_on).getTime() - new Date(last_off).getTime();
            const diffMinutes = diffMs / (1000 * 60);

            if (diffMinutes < 60) {
                return `${diffMinutes.toFixed(0)} minutes`
            } else if (diffMinutes < 60 * 24) {
                const diffHours = diffMinutes / 60;
                return `${diffHours.toFixed(0)} hours`
            } else {
                const diffDays = diffMinutes / (60 * 24);
                return `${diffDays.toFixed(0)} days`
            }
        } else {
            return "Currently Off"
        }
    }

    function formatTimestamp(iso: string | undefined) {
        if (!iso) return "Never";
        return new Date(iso).toLocaleString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }
    return (
    <div className='w-full flex justify-center h-[850px]'>
        <div className="flex-1 h-full flex justify-center items-center">
            <div className="border-[#2E5E8A] border-1 rounded-xl h-full w-[90%] drop-shadow-xl">
                <h1 className="text-center mt-5 font-bold text-[25px]">Device History</h1>
                <div className="w-full flex pb-5 items-center flex-col">
                    {
                        historyDeviceDataSet.map((data, index) => {
                            return (
                                <button onClick={() => handleDeviceClick(data)} className="bg-[rgba(255,176,25,0.75)] select-none cursor-pointer mt-5 flex items-center justify-between border-1 rounded-xl h-[50px] w-[90%]" key={index}>
                                    <h1 className="font-bold ml-5">{data?.deviceName}</h1>
                                    <h1 className="font-bold mr-5">See History {">"}</h1>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
        <div className="flex-1 h-full flex justify-center">
            <div className="border-1 border-[#2E5E8A] rounded-xl h-[850px] w-[90%]">
                    <div className={`${deviceInfoShow ? "" : "hidden"}`}>
                        <div className="flex justify-center items-center">
                            <h1 className="text-center font-bold text-[25px] mt-5">{currentDeviceData?.deviceName}</h1>
                            <h1 className="text-center font-thin text-[25px] ml-5 mt-5">Port {currentDeviceData?.portId}</h1>
                        </div>
                        <div className="mt-5">
                            {currentDeviceData ? <DeviceHistoryGraph dailyGraph={currentDeviceData.dailyPowerConsumption} monthlyGraph={currentDeviceData.monthlyPowerConsumption} yearlyGraph={currentDeviceData.yearlyPowerConsumption}/> : ""}
                        </div>
                        <div className="w-full flex justify-center items-center ">
                            <div className="flex gap-5 w-[90%] mt-5 justify-center items-center">
                                <div className="flex-1 flex-col flex rounded-xl justify-center items-center border-[#2E5E8A] border-1">
                                    <h1 className="text-center font-bold pt-5">Last Active</h1>
                                    <h1 className="text-center pb-5">{formatTimestamp(currentDeviceData?.deviceLastMonitored) || "Never"}</h1>
                                </div>
                                <div className="flex-1 flex-col flex rounded-xl justify-center items-center border-[#2E5E8A] border-1">
                                    <h1 className="text-center font-bold pt-5">Current Active Time</h1>
                                    <h1 className="text-center pb-5">{getLastActiveTime(currentDeviceData?.portId)}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-center items-center mt-5 ">
                            <div className="w-[90%] border-1 border-[#2E5E8A] rounded-xl pb-5">
                                <h1 className="font-bold ml-5 mt-5 mb-5 text-[20px]">Average Usage: </h1>
                                <div className="w-full flex justify-center items-center">
                                    <div className="w-[95%] flex justify-center items-center gap-5">
                                        <div className="flex flex-col items-center justify-center border-[#2E5E8A] border-1 rounded-xl pt-5 pb-5 pr-5 pl-5">
                                            <h1 className="font-bold text-center">Daily Average</h1>
                                            <h1 className="font-bold text-[25px]">{currentDeviceData?.dailyAverageUsage?.toFixed(2) || 0} hrs</h1>
                                        </div>
                                        <div className="flex flex-col items-center justify-center border-[#2E5E8A] border-1 rounded-xl pt-5 pb-5 pr-5 pl-5">
                                            <h1 className="font-bold text-center">Monthly Average</h1>
                                            <h1 className="font-bold text-[25px]">{currentDeviceData?.monthlyAverageUsage?.toFixed(2) || 0} hrs</h1>
                                        </div>
                                        <div className="flex flex-col items-center justify-center border-[#2E5E8A] border-1 rounded-xl pt-5 pb-5 pr-5 pl-5">
                                            <h1 className="font-bold text-center">Yearly Average</h1>
                                            <h1 className="font-bold text-[25px]">{currentDeviceData?.yearlyAverageUsage?.toFixed(2) || 0} hrs</h1>
                                        </div>
                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default DeviceHistory