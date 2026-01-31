const ConsumptionCounter = ({totalConsumption = 231, label = "This Week"} : {totalConsumption: number, label: string}) => {
  return (
    <div className="flex w-full h-[100%] justify-center items-center xl:h-full xl:w-full">
        <div className="flex flex-col justify-center items-center border-1 border-[#2E5E8A] rounded-xl h-[85%] w-[95%] shadow-xl/20">
            <h1 className="text-md font-bold">Total Consumption</h1>
            <h1 className="text-3xl font-bold">{totalConsumption} kWh</h1>
            <h1 className="text-md">{label}</h1>
        </div>
    </div>
  )
}

export default ConsumptionCounter