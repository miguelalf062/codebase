import bulbImage from "../assets/bulb.png"

const ForecastComparison = ({actualConsumption = 200, forecastedConsumption = 460} : {actualConsumption: number, forecastedConsumption: number}) => {
    const isForecastGreater = forecastedConsumption >= actualConsumption;
    const isItEqual = forecastedConsumption == actualConsumption;
    const higherConsumption = actualConsumption >= forecastedConsumption ? actualConsumption : forecastedConsumption;
    const lowerConsumption = actualConsumption < forecastedConsumption ? actualConsumption : forecastedConsumption;
    const percentRatioConsumption = parseFloat(((lowerConsumption / higherConsumption) * 100).toFixed(2));
    return (
    <div className='flex flex-col items-center border-1 rounded-xl bg-[#F8C563] w-[90%] h-[320px]'>
        <h1 className='mt-5 font-bold text-[20px] text-black'>Forecast Accuracy This Month</h1>
        <div className='w-full flex justify-center items-center flex-col mt-5'>
            <div className='w-[95%] h-[50px] bg-[rgba(255, 176, 25, 1 )] filter shadow-xl border-1 border-gray-500 rounded-xl flex justify-center items-center'>
                <h1 className='w-[25%] text-center font-bold text-black text-[10px]'>Actual Consumption</h1>
                <div className='w-[50%] bg-[rgba(217,149,18,0.44)] rounded-xl h-[20%] shadow-inner shadow-lg flex items-center'>
                    <div className='h-[200%] bg-[#986607] rounded-xl' style={{width: `${isForecastGreater ?  percentRatioConsumption : 100}%`}}></div>
                </div>
                <h1 className='w-[25%] font-bold text-[15px] text-center text-black'>{actualConsumption} kWh</h1>
            </div>
            <div className='mt-5 w-[95%] h-[50px] bg-[rgba(255, 176, 25, 1 )] filter shadow-xl border-1 border-gray-500 rounded-xl flex justify-center items-center'>
                <h1 className='w-[25%] text-center font-bold text-black text-[10px]'>Forecasted Consumption</h1>
                <div className='w-[50%] bg-white rounded-xl h-[20%] shadow-inner shadow-lg flex items-center'>
                    <div className='h-[200%] bg-[#2E5E8A] rounded-xl' style={{width: `${isForecastGreater ? 100 : percentRatioConsumption}%`}}></div>
                </div>
                <h1 className='w-[25%] font-bold text-[15px] text-center text-black'>{forecastedConsumption} kWh</h1>
            </div>

            <div className="flex items-center w-[95%] bg-[rgba(31,58,95,0.15)] mb-5 rounded-xl h-[75px] shadow-inner shadow-lg mt-5">
                <img src={bulbImage} className="ml-5 w-15" />
                <h1 className="text-[15px] mr-5 text-black text-center">Forecast is trending {isItEqual ? "equal" : isForecastGreater ? "higher" : "lower"} than actual this month.</h1>
            </div>
        </div>

    </div>
  )
}

export default ForecastComparison