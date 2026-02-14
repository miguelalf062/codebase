import billImage from '../assets/bill.png';

const EstimatedBill = ({estimatedBill = 1000, prevBill = 1200, meralcoRate = 13.47} : {estimatedBill: number, prevBill: number, meralcoRate: number}) => {
  
  return (
    <div className='w-full h-[15vh] xl:h-[50%] flex justify-center items-center'>
        <div className='rounded-xl border-1 border-[#2E5E8A] w-[90%] h-[90%] bg-[#f5b335] shadow-xl/20 flex align-center'>
            <img src={billImage} alt="Bill" className='xl:relative xl:translate-x-10 ml-5 scale-75 flex justify-center items-center h-[100%] w-[30%]' />
            <div className='xl:scale-100 scale-90 w-full flex flex-col justify-center align-center *:text-center *:m-0 mr-6'>
              <h1 className='text-xl font-bold'>Estimated Bill</h1>
              <h1 className='text-[20px] font-extrabold m-0 p-0'>P{estimatedBill} <span className={prevBill > estimatedBill ? "text-[#00AA00]" : prevBill < estimatedBill ? "text-[#FF0000]" : "text-gray-500"}> {prevBill > estimatedBill ? "▲" : prevBill < estimatedBill ? "▼" : "—"} </span></h1> 
              <h1 className='text-[10px]'>based on Meralco rate as of January 2026</h1>
              <h1 className='font-bold'>P{meralcoRate}/kWh</h1>
            </div>
        </div>
    </div>
  )
}

export default EstimatedBill