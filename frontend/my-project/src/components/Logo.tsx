import logo from '../assets/logo.png'
const Logo = () => {
  return (
    <>

        <div className='w-full flex flex-row items-center border-b border-gray-300 h-12 md:h-14 xl:h-20'>
            <div className='flex flex-row items-center gap-2'>
                <img src={logo} alt="Logo" className='w-7.5 h-7.5 xl:w-10 xl:h-10 ml-2' />
                <h1 className='font-inter text-2xl xl:text-5xl font-extrabold tracking-widest'>EMBER</h1>
            </div>

        </div>

    </>
)
}

export default Logo