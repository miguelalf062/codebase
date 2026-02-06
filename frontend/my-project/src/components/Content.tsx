import Dashboard from './Dashboard'
import Devices from './Devices'
import Forecasting from './Forecasting'
import History from './History'

type dataset = { day: string; value: number }[];

const dummyData: dataset = [];
const dummyForecastData: dataset = [];
for (let i = 1; i <= 24; i++) {
  dummyData.push({
    day: `Hour ${i}`,
    value: Math.floor(Math.random() * 3000) + 1
  });
  dummyForecastData.push({
     day: `Hour ${24 + i}`,
    value: Math.floor(Math.random() * 3000) + 1 
  })

}

const Content = ({ activeTab }: { activeTab: string }) => {


  return (
    <>
        <main className='flex-1 w-full h-full'>
            {activeTab === 'Dashboard' && <Dashboard dashboardGraphData={dummyData} />}
            {activeTab === 'Devices' && <Devices/>}
            {activeTab === 'Forecasting' && <Forecasting />}
            {activeTab === 'History' && <History />}
        </main>
    </>
  )
}

export default Content