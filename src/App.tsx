import {  useState , useEffect } from 'react'
import Header from'./components/Header'
import SearchCity from './components/SearchCity'

import type { CityData } from './types/CityData'
import WeatherCard from './components/WeatherCard'



function App() {

  const [cities , setCities] = useState<CityData[]>([])
  const handlAddCity =(city: CityData) =>{
    setCities(prev => [...prev , city])
  }

  const handRemoveCity = (id: number) =>{
    setCities(prev => prev.filter(c => c.id !== id))
  }

 
  
  useEffect(()=>{
    const touchCities = ()=>{
      let copyCities: CityData[] = [...cities]
      copyCities = copyCities.map(city => ({...city, updatedAt: new Date()}));
      setCities(copyCities)
    }

    const interval = setInterval( ()=>{
      touchCities()
    }, 5000)
    return ()=> clearInterval(interval)
  },[cities]);
  
  return (
    <div className='flex flex-col gap-4 py-6 px-5'>
      <Header/>
      <SearchCity handlAddCity={handlAddCity}/>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
          {cities.map((city) => (
            <WeatherCard key={city.id} city={city} handRemoveCity={handRemoveCity} />
          ))}
        </div>
    </div>
  )
}

export default App
