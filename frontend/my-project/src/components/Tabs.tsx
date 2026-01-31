const Tabs = ({ setActiveTab, activeTab }: { setActiveTab: (tab: string) => void; activeTab: string }) => {
  
  
  
  return (
    <>
        <div className='xl:h-full flex justify-center border-b border-gray-300 xl:border-r xl:border-gray-300 xl:w-1/6'>
          <div className="flex flex-space flex-row gap-3 w-full xl:pl-5 xl:pr-5 h-[50px] xl:h-1/4 xl:flex-col xl:gap-6 xl:mt-5">
              
              {["Dashboard", "Devices", "Forecasting", "History"].map((tabItem) => {
                  return <div key={tabItem} onClick={() => setActiveTab(tabItem)} 
                  className={`transition-all ease-in-out duration-500 hover:bg-[#a17623] font-bold xl:w-[100%] h-[100%] select-none cursor-pointer flex justify-center text-center 
                    ${activeTab === tabItem ? 'xl:bg-[#F5B335] bg-[#F5B335] text-white' : ''} items-center flex-1 rounded text-sm`}>{tabItem}</div>;
              })}
          </div>
        </div>
        
    </>
  )
}

export default Tabs