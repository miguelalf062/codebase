import forecastGlobeImage from "../assets/forecastGlobe.png";

const ForecastReminder1 = ({totalForecastConsumption = 231} : {totalForecastConsumption: number}) => {


  return (
    <div className='flex w-[100%] xl:w-[100%] xl:mt-40 xl:h-[100%] xl:pb-5 xl:pt-5 border-1 border-[#2E5E8A] h-[100%] rounded-2xl bg-gradient-to-b from-blue-200 to-blue-400
    shadown-inner shadow-lg'>
        <div className="h-full ml-1 xl:ml-10 w-20 flex justify-center align-center items-center">
        <img src={forecastGlobeImage} className="xl:w-[150px] xl:h-[100px] w-15 h-17" alt="" />
        </div>
        <div className="xl:scale-150 flex flex-col justify-center flex-1 mr-3">
            <h1 className="font-bold text-[14px] h-[15px] text-center mt-1">Total Forecast Consumption</h1>
            <h1 className="font-bold text-[30px] h-[35px] text-center">{totalForecastConsumption} kWh</h1>
            <h1 className="font-thin text-center">Expected This Month</h1>
        </div>
    </div>
  )
}

export default ForecastReminder1