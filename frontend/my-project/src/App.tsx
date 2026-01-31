import { useState } from 'react'
import './App.css'
import Logo from './components/Logo'
import Tabs from './components/Tabs'
import Content from './components/Content';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');


  return (
    <>
      <Logo />
      <div className='flex flex-col h-screen xl:flex-row'>
      <Tabs setActiveTab={setActiveTab} activeTab={activeTab} />
      <Content activeTab={activeTab} />
      </div>  
    </>
  )
}

export default App
