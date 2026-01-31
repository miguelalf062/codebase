import { useState } from 'react';
import ConsumptionCounter from './ConsumptionCounter';
import PowerConsumptionGraph from './PowerConsumptionGraph';
import ComsumptionComparison from './ComsumptionComparison';
import EstimatedBill from './EstimatedBill';
import DeviceRankingConsumption from './DeviceRankingConsumption';
import Reminder from './Reminder';


type dataset = { day: string; value: number }[];

const Dashboard = (props : {dashboardGraphData: dataset}) => {
  const [graphData] = useState<dataset>(props.dashboardGraphData);
  const [weeklyConsumption] = useState<number>(231);
  const [monthlyConsumption] = useState<number>(1023);
  const [deviceRankings] = useState<{name: string; consumption: number}[]>([
    {name: 'Air Conditioner', consumption: 350},    
    {name: 'Refrigerator', consumption: 200},    
    {name: 'Washing Machine', consumption: 250},    
    {name: 'Television', consumption: 100},    
  ]);

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
          <ComsumptionComparison currentConsumption={62} yesterdayConsumption={80}/>
          </div>
        </div>
      </div>

      {/* 2nd group container*/}
      <div className='xl:flex align-center'>
        <DeviceRankingConsumption deviceData={deviceRankings}/>
        <div className='xl:mt-2'>
          <EstimatedBill estimatedBill={1000} prevBill={1200} meralcoRate={13.47} />
          <Reminder deviceName='Refrigerator' />
        </div>
      </div>
    </div>
  )
}

export default Dashboard