import billImage from "../assets/bill.png";

const ForecastReminder2 = ({totalForecastConsumption = 231, meralcoRate = 13.47} : {totalForecastConsumption: number, meralcoRate: number}) => {


  return (
    <div className='flex mt-5 w-[100%] xl:w-[100%] xl:h-[100%] xl:pb-5 xl:pt-5 border-1 border-[#2E5E8A] h-[100%] rounded-2xl bg-[#93BBD8] shadown-inner shadow-lg'>
        <div className="h-full ml-1 xl:ml-10 w-20 flex justify-center align-center items-center">
        <img src={billImage} className="xl:w-[150px] xl:h-[100px] w-15 h-17" alt="" />
        </div>
        <div className="xl:scale-150 flex flex-col justify-center flex-1 mr-3">
            <h1 className="font-bold text-[14px] h-[15px] text-center mt-1">Estimated Meralco Bill</h1>
            <h1 className="font-thin mt-2 text-[15px] h-[35px] text-center">Based on Meralco rate of P{meralcoRate}/kWh</h1>
            <h1 className="font-bold mt-[-20px] text-[30px] text-center">P{((totalForecastConsumption/1000) * meralcoRate).toFixed(2)}</h1>
        </div>
    </div>
  )
}

export default ForecastReminder2