import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";

type dataset = { day: string; value: number };

const PowerConsumptionGraph = (props : {dashboardGraphData: dataset [], label: string}) => {
    return (
    <div className="xl:col-span-3 xl:flex xl:justify-center">
          <div className='flex xl:w-[90%] xl:h-[40vh] justify-center'>         
            <div className='xl:shadow-xl/20 shadow-xl xl:w-[100%] xl:h-[100%] w-[90%] border-[#2E5E8A] border-1 rounded-[25px] flex justify-center flex-col items-center h-[200px]'  >
              <h1 className='xl:relative xl:top-4 xl:ml-10 mt-5 text-xl w-full font-bold ml-5 xl:text-2xl'>Power Consumption</h1>
              <h1 className='xl:mr-10 text-md w-full text-right mr-5'>{props.label}</h1>
              
    
            
              <LineChart  style={{ width: '90%', height: 280}} responsive data={props.dashboardGraphData}>
                <Line stroke="#F5B335" dataKey="value" name="Power Consumption" strokeWidth={2}/>
                <XAxis dataKey="day" tickFormatter={(_,index) => (index+1).toString()} /> 
                <YAxis width={40} tick={{ fontSize: 10 }} tickFormatter={(value) => `${(value / 1000).toFixed(1)}`}label={{value:"kiloWatt-hour", fontSize: 14,angle: -90, position:"insideLeft", textAnchor:"middle"}} />
                <CartesianGrid />
                <Tooltip />
    
              </LineChart>
            </div>
          </div>
        </div>
  )
}

export default PowerConsumptionGraph