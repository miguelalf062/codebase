import calendarImage from "../assets/calendar.png"

const HistoryInfo3 = ({currentAmount, label1} : {currentAmount: number, label1: string}) => {
  return (
    <div className='w-full h-auto flex justify-center items-center mt-5 mb-5'>
        <div className='border-1 border-[#2E5E8A] rounded-xl w-[90%] h-[100px] flex flex-col items-center'>
            <div className="flex items-center mt-2">
              <img src={calendarImage} className="w-[40px]" />
              <h1 className="font-bold text-[20px] text-center ml-1">{label1}</h1>
            </div>
            <div className='flex w-full text-center items-center justify-center'>
                <h1 className="font-bold text-[25px] text-center">{currentAmount} kWh </h1>
            </div>
        </div>
    </div>
  )
}

export default HistoryInfo3