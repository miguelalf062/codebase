import { useEffect, useState } from 'react';
import ConsumptionCounter from './ConsumptionCounter';
import PowerConsumptionGraph from './PowerConsumptionGraph';
import ComsumptionComparison from './ComsumptionComparison';
import EstimatedBill from './EstimatedBill';
import DeviceRankingConsumption from './DeviceRankingConsumption';
import Reminder from './Reminder';


type dataset = { day: string; value: number }[];
type hourlyDataPoint = {module_id: string; hour_start: string; avg_current: string; avg_voltage: string; total_power: string}


const Dashboard = (props : {dashboardGraphData: dataset}) => {
  const [graphData, setGraphData] = useState<dataset>(props.dashboardGraphData);
  const [totalPowerConsumptionToday, setTotalPowerConsumptionToday] = useState(0);
  const [totalPowerConsumptionYesterday, setTotalPowerConsumptionYesterday] = useState(0);

  const [weeklyConsumption, setWeeklyConsumption] = useState<number>(0);
  const [monthlyConsumption, setMonthlyConsumption] = useState<number>(0);
  const [lastMonthConsumption, setLastMonthConsumption] = useState<number>(0);
  const [deviceRankings, setDeviceRankings] = useState<{name: string; consumption: number}[]>([]);

  // {name: 'Air Conditioner', consumption: 350},    
  // {name: 'Refrigerator', consumption: 200},    
  // {name: 'Washing Machine', consumption: 250},    
  // {name: 'Television', consumption: 100},   

  const [meralcoRate] = useState(13.47);
  const [estimatedBill, setEstimatedBill] = useState(0)

  useEffect(() => {
    const fetchHourlyData = () => {
      fetch("/api/last/hours").then(data => data.json()).then((data : hourlyDataPoint[]) => {
          const consumption: Record<string, number> = {}
          //Object.fromEntries(
          //  Array.from({ length: 24 }, (_, h) => [h.toString().padStart(2, "0"), 0])
          //);

          let totalPowerToday = 0;
          if (!data) return;
          data.forEach(dataPoint => {
              const hour = dataPoint.hour_start[11] + dataPoint.hour_start[12]
              consumption[hour] = 0;
          })

          data.forEach(dataPoint => {
              const hour = dataPoint.hour_start[11] + dataPoint.hour_start[12]
              consumption[hour] += parseFloat(dataPoint.total_power);
              totalPowerToday += parseFloat(dataPoint.total_power);
          })

          const newGraphData = Object.keys(consumption).sort()
            .map(hour => ({day: `hour ${parseInt(hour) + 1}`, value: consumption[hour]}));

          console.log(newGraphData)
          setGraphData(newGraphData);
          setTotalPowerConsumptionToday(totalPowerToday);
      })

      fetch("/api/last/yesterday").then(data => data.json()).then((data : hourlyDataPoint[]) => {
        let totalPowerYesterday = 0; 
        data.forEach(dataPoint => {
            totalPowerYesterday += parseFloat(dataPoint.total_power);
          })
        setTotalPowerConsumptionYesterday(totalPowerYesterday);
      })

      fetch("/api/weeksByHour").then(data => data.json()).then((data : hourlyDataPoint[]) => {
        let totalPowerthisWeek = 0; 
        data.forEach(dataPoint => {
            totalPowerthisWeek += parseFloat(dataPoint.total_power);
          })
        setWeeklyConsumption(totalPowerthisWeek);
      })

      fetch("/api/monthsByHour").then(data => data.json()).then((data : hourlyDataPoint[]) => {
        let totalPowerthisMonth = 0;
        const perDeviceThisMonthConsumption: Record<string, number> = {}; 
        data.forEach(dataPoint => {
            totalPowerthisMonth += parseFloat(dataPoint.total_power);
            perDeviceThisMonthConsumption[`Module ${dataPoint.module_id}`] = 0;
        })
        
        data.forEach(dataPoint => {
            perDeviceThisMonthConsumption[`Module ${dataPoint.module_id}`] += 0;
        })

        // set device ranking
        const deviceRankingFormatted = Object.keys(perDeviceThisMonthConsumption).map(device => {
          return {name: device, consumption: perDeviceThisMonthConsumption[device] }
        }).sort((a, b) => b.consumption - a.consumption);
        setDeviceRankings(deviceRankingFormatted);
        console.log(deviceRankingFormatted)
        // set monthly consumption stuff
        setMonthlyConsumption(totalPowerthisMonth);
        setEstimatedBill(parseFloat(((totalPowerthisMonth / 1000) * meralcoRate).toFixed(2)))
      })

      fetch("/api/last/months").then(data => data.json()).then((data : hourlyDataPoint[]) => {
        let totalPowerLastMonth = 0; 
        data.forEach(dataPoint => {
            totalPowerLastMonth += parseFloat(dataPoint.total_power);
          })
        setLastMonthConsumption(totalPowerLastMonth);
      })
    }

    fetchHourlyData();
    const now = new Date();
    const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    let intervalId: number;

    const timeoutId = window.setTimeout(() => {
      fetchHourlyData();
      intervalId = window.setInterval(fetchHourlyData, 60 * 60 * 1000);
    }, msUntilNextHour);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  },[meralcoRate])
  

  return (
    <div>
      {/* 1st group container*/}
      <div className="xl:grid xl:grid-cols-6 mt-5">
        <PowerConsumptionGraph dashboardGraphData={graphData} />
        <div className='flex border-1 border-white items-center mt-[2.5px] xl:col-span-3 h-[30vh] xl:h-[40vh]'>
          <div className="flex flex-col h-full border-1 border-white w-1/2 h-full">
          <ConsumptionCounter totalConsumption={weeklyConsumption} label="This Week" />
          <ConsumptionCounter totalConsumption={monthlyConsumption} label="This Month" />
          </div>
          <div className="w-1/2 border-1 border-white h-full">
          <ComsumptionComparison currentConsumption={totalPowerConsumptionToday} yesterdayConsumption={totalPowerConsumptionYesterday}/>
          </div>
        </div>
      </div>

      {/* 2nd group container*/}
      <div className='xl:flex align-center'>
        <DeviceRankingConsumption deviceData={deviceRankings}/>
        <div className='xl:mt-2'>
          <EstimatedBill estimatedBill={estimatedBill} prevBill={lastMonthConsumption} meralcoRate={meralcoRate} />
          <Reminder deviceName={`${deviceRankings[0]?.name ? deviceRankings[0].name :  "[No device]"} `} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard