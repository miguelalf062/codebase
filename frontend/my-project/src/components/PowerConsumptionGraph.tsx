import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, 

} from "recharts";

type dataset = { day: string; value: number };

type TooltipPayloadItem = {
  value?: number | string;
  name?: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const raw = payload[0].value;
  const value = typeof raw === "number" ? raw : Number(raw);

  return (
    <div
      style={{
        background: "white",
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div style={{ color: "#F5B335" }}>
        Power Consumption (W): {value.toFixed(2)}
      </div>
    </div>
  );
};


const PowerConsumptionGraph = (props : {dashboardGraphData: dataset [], label: string}) => {
  console.log(props.dashboardGraphData)  
  return (
    <div className="xl:col-span-3 xl:flex xl:justify-center">
          <div className='flex xl:w-[90%] xl:h-[40vh] justify-center'>         
            <div className='xl:shadow-xl/20 shadow-xl xl:w-[100%] xl:h-[100%] w-[90%] border-[#2E5E8A] border-1 rounded-[25px] flex justify-center flex-col items-center h-[200px]'  >
              <h1 className='xl:relative xl:top-4 xl:ml-10 mt-5 text-xl w-full font-bold ml-5 xl:text-2xl'>Power Consumption</h1>
              <h1 className='xl:mr-10 text-md w-full text-right mr-5'>{props.label}</h1>
              
    
            
              <LineChart  style={{ width: '90%', height: 280}} responsive data={props.dashboardGraphData}>
                <Line stroke="#F5B335" dataKey="value" name="Power Consumption (W)" strokeWidth={2}/>
                <XAxis
                    dataKey="day"
                    interval={2}
                    label={{
                      value: "Time",
                      position: "bottom",
                      offset: -10,
                      fontSize: 12,
                    }}
                    tickFormatter={(label) => {
                      const match = String(label).match(/hour\s+(\d+)/i);
                      if (!match) return String(label);

                      const hour24 = Number(match[1]);
                      const isPM = hour24 >= 12;
                      const displayHour = hour24 % 12 || 12;

                      return `${displayHour}${isPM ? "PM" : "AM"}`;
                    }}
                />
                <YAxis width={40} tick={{ fontSize: 10 }} tickFormatter={(value) => `${(value / 1000).toFixed(1)}`}label={{value:"kiloWatt-hour", fontSize: 14,angle: -90, position:"insideLeft", textAnchor:"middle"}} />
                <CartesianGrid />
                <Tooltip
                  labelFormatter={(label) => {
                    if (typeof label === "string" && !Number.isNaN(Date.parse(label))) {
                      const hour = new Date(label).getHours();
                      const isPM = hour >= 12;
                      const displayHour = hour % 12 || 12;
                      return `${displayHour}${isPM ? "PM" : "AM"}`;
                    }

                    const maybeHour = Number(label);
                    if (!Number.isNaN(maybeHour)) {
                      const hour = maybeHour;
                      const isPM = hour >= 12;
                      const displayHour = hour % 12 || 12;
                      return `${displayHour}${isPM ? "PM" : "AM"}`;
                    }

                  
                    return String(label);
                  }}
                  formatter={(value) => [Number(value).toFixed(2), "Power Consumption (W)"]}
                  content={<CustomTooltip />}
              />
    
              </LineChart>
            </div>
          </div>
        </div>
  )
}

export default PowerConsumptionGraph