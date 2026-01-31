import Dashboard from './Dashboard'
import Devices from './Devices'
import Forecasting from './Forecasting'
import History from './History'

type dataset = { day: string; value: number }[];
const dummyData: dataset = [];
for (let i = 1; i <= 24; i++) {
  dummyData.push({
    day: `Hour   ${i}`,
    value: Math.floor(Math.random() * 3000) + 1 
  });
}

const Content = ({ activeTab }: { activeTab: string }) => {


  return (
    <>
        <main className='flex-1 w-full h-full'>
            {activeTab === 'Dashboard' && <Dashboard dashboardGraphData={dummyData} />}
            {activeTab === 'Devices' && <Devices devicesData={[
            {id: 1, name: "Device 1", status: "On", current: 2.5, voltage: 220, power: 550},
            {id: 2, name: "Device 2", status: "Off", current: 0, voltage: 0, power: 0},
            {id: 3, name: "Device 3", status: "On", current: 1.2, voltage: 220, power: 264},
            {id: 4, name: "Device 4", status: "On", current: 3.0, voltage: 220, power: 660},
            {id: 5, name: "Device 5", status: "Off", current: 0, voltage: 0, power: 0},
            {id: 6, name: "Device 6", status: "On", current: 0.8, voltage: 220, power: 176},
            {id: 7, name: "Device 7", status: "On", current: 2.0, voltage: 220, power: 440},
             ]}/>}
            {activeTab === 'Forecasting' && <Forecasting />}
            {activeTab === 'History' && <History />}
        </main>
    </>
  )
}

export default Content