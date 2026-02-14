import top1 from '../assets/top1.png';
import top2 from '../assets/top2.png';
import top3 from '../assets/top3.png';
import top4 from '../assets/top4.png';


type deviceData = {name: string; consumption: number}[];
const DeviceRankingConsumption = ({deviceData = [
    {name: 'Air Conditioner', consumption: 350},    
    {name: 'Refrigerator', consumption: 200},    
    {name: 'Washing Machine', consumption: 250},    
    {name: 'Television', consumption: 100},    
]} : {deviceData: deviceData}) => {
    const images = [top1, top2, top3, top4];
    const deviceBgColors = ['rgba(31, 58, 95, 0.6)', 'rgba(31, 58, 95, 0.4)', 'rgba(31, 58, 95, 0.2)', 'rgba(31, 58, 95, 0.15)'];
    

    return (
        <div className="xl:w-[50%] w-full h-[40vh] flex justify-center items-center">
            <div className="bg-[#9EC9E8] w-[95%] h-[90%] rounded-xl *:w-full flex justify-center align-center flex-col">
                <h1 className="h-[20%] font-bold text-[16px] flex justify-center items-center text-center"> Top Power-Consuming Devices 
                    <span className="font-normal ml-1"> (This Month)</span>
                </h1>
                <div className="flex flex-col items-center justify-center h-[75%] mt-1 gap-2">
                    {deviceData.map((device, index) => {
                        return (
                            <div className="rounded-sm w-[95%] h-full flex items-center" style={{ backgroundColor: deviceBgColors[index] }}>
                                <img src={images[index]} alt={`Top ${index + 1}`} className="w-10 h-10 ml-3 mr-2" />
                                <h1 className="xl:w-[20%] w-[31%] text-[#FFFFFF] font-bold text-[12px] mr-1">{device.name}</h1>
                                <div className="xl:w-[50%] w-[30%] bg-gray-300 h-2 rounded-xl">
                                    <div className={`transition duration-300 ease-in-out h-full bg-yellow-500 rounded-xl`} style={{ width: `${Math.floor(device.consumption / deviceData[0].consumption * 100)}%` }}></div>
                                </div>
                                <h1 className="w-[20%] text-[#FFFFFF] font-bold text-[12px] ml-auto mr-2 w-fit">{device.consumption.toFixed(2)} kWh</h1>
                            </div>
                        )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DeviceRankingConsumption