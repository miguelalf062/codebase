const HistoryInfo2 = ({currentAmount, label1} : {currentAmount: number, label1: string}) => {
  return (
    <div className='w-full h-auto flex justify-center items-center mt-5 mb-5'>
        <div className='border-1 border-[#2E5E8A] rounded-xl w-[90%] h-[75px]'>
            <h1 className="font-bold text-[20px] text-center"><span className="text-green-500">▼</span> Lowest Usage</h1>
            <div className='flex w-full text-center items-center justify-center'>
                <h1 className="font-bold text-[25px] text-center">{currentAmount} kWh </h1>
                <h1 className="font-thin text-[15px] text-center ml-5">{label1}</h1>
            </div>
        </div>
    </div>
  )
}

export default HistoryInfo2