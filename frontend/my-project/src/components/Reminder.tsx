import bulb from '../assets/bulb.png'

const Reminder = ({deviceName = "refrigarator"} : {deviceName : string}) => {
  return (
    <div className='flex justify-center align-center mt-2 xl:mt-11'>
        <div className="flex justify-center align-center border-1 border-[rgba(245, 179, 53, 0.5)] shadow-2xl rounded-xl xl:h-[100%] h-[10vh] w-[90%]">
            <img src={bulb} className='xl:mr-5 w-15 h-15' alt="Bulb Icon" />
            <div>
                <h1 className="font-bold text-lg text-shadow-lg text-shadow-yellow-300">Ember Reminder:</h1>
                <p className="text-sm xl:w-[80%]">Your {deviceName} is the top contributor to your electricity bill this month.</p>
            </div>
        </div>
    </div>
  )
}

export default Reminder