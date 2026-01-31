import fire from "../assets/fire.png"

type devicesData = {
  id: number,
  name: string,
  status: string,
  current: number,
  voltage: number,
  power: number
}[];

const Devices = ({devicesData = [
  {id: 1, name: "Device 1", status: "On", current: 2.5, voltage: 220, power: 550},
  {id: 2, name: "Device 2", status: "Off", current: 0, voltage: 0, power: 0},
  {id: 3, name: "Device 3", status: "On", current: 1.2, voltage: 220, power: 264},
  {id: 4, name: "Device 4", status: "On", current: 3.0, voltage: 220, power: 660},
  {id: 5, name: "Device 5", status: "Off", current: 0, voltage: 0, power: 0},
  {id: 6, name: "Device 6", status: "On", current: 0.8, voltage: 220, power: 176},
  {id: 7, name: "Device 7", status: "On", current: 2.0, voltage: 220, power: 440},
]} : {devicesData: devicesData}) => {

  function toggleDeviceStatus(id: number) {
    // Placeholder function to toggle device status
    console.log(`Toggling device ${id}`);
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 xl:gap-10 gap-2 p-2">
      {devicesData.map((device) => {
        return (
          <div key={device.id} className="border-1 drop-shadow-xl border-[#2E5E8A] rounded-2xl p-4 mb-4 shadow-lg flex justify-center items-center flex-col">
            <h2 className="text-xl font-bold mb-2">{device.name}</h2>
            <img src={fire} className='w-30 h-30 mb-5 mt-5' alt="" />
            <p>Status: <span className={device.status === "On" ? "text-green-500" : "text-red-500"}>{device.status}</span></p>
            <p>Current: {device.current} A</p>
            <p>Voltage: {device.voltage} V</p>
            <p className="font-bold">Power: {device.power} W</p>
            <button onClick={() => toggleDeviceStatus(device.id)} className={device.status === "On" ? "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-4" : 
              "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-4"}> 
              {device.status === "On" ? "Turn Off" : "Turn On"} 
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Devices