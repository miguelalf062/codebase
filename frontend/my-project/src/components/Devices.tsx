import { useEffect, useState } from "react";
import fire from "../assets/fire.png"

type DevicesData = {
  id: number,
  name: string,
  status: boolean,
  current: number,
  voltage: number,
  power: number,
  timestamp: string
};


const Devices = () => {
  const [devicesData , setDevicesData] = useState<DevicesData []>([]); 

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;

    const fetchModules = async () => {
      try {
        const res = await fetch("/api/dashboard/modules");
        const modulesData: DevicesData[] = await res.json();
        console.log("Done fetching modules data status:", res.status);
        if (isMounted) {
          setDevicesData(modulesData);
        }
      } catch (err) {
        console.error("Failed to fetch modules", err);
      }
    };

    fetchModules();

    const INTERVAL_SECONDS = 5; // CHANGE KUNG ILAN TRIP NA INTERVAL

    const now = new Date();
    const msUntilNextMinute =
      (INTERVAL_SECONDS - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeoutId = window.setTimeout(() => {
      fetchModules();
      intervalId = window.setInterval(fetchModules, INTERVAL_SECONDS * 1000);
    }, msUntilNextMinute);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  } ,[])


  function toggleDeviceStatus(id: number, deviceStatus: boolean) {
    // Placeholder function to toggle device status
    console.log(`Toggling device ${id} ${deviceStatus}`);
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 xl:gap-10 gap-2 p-2">
      {devicesData.length > 0 && devicesData.map((device, index) => {
        return (
          <div key={index} className="border-1 drop-shadow-xl border-[#2E5E8A] rounded-2xl p-4 mb-4 shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl font-bold mb-2">{device.name}</h2>
            <img src={fire} className='w-30 h-30 mb-5 mt-5' alt="" />
            <p>Status: <span className={device.status ? "text-green-500" : "text-red-500"}>{device.status}</span></p>
            <p>Current: {device.current} A</p>
            <p>Voltage: {device.voltage} V</p>
            <p className="font-bold">Power: {device.power} W</p>
            <button onClick={() => toggleDeviceStatus(device.id, device.status)} className={device.status ? "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-4" : 
              "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-4"}> 
              {device.status ? "Turn Off" : "Turn On"} 
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Devices