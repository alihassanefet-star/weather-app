import  { useRef, useState } from "react"
import type { CityData, CityDataApiResponse } from "../types/CityData"

type props = {
  handlAddCity: (city: CityData) =>void;
}

function SearchCity({handlAddCity}: props){
    const [results , setResults] = useState<CityData[]>([]) 
    const inputRef = useRef<HTMLInputElement>(null)
    const handleSearch =(e: React.ChangeEvent<HTMLInputElement>)=>{
        const newQuery = e.target.value;
        if(newQuery.length < 3){
            setResults([])
            return
        }
        const fetchCities = async() =>{

            const response =await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${newQuery}`)
            const data: CityDataApiResponse = await response.json()
           setResults(data.results ?? [])
        }
        fetchCities()

    }
    const handlAddCityClick = (city: CityData) =>{
        handlAddCity({...city , updatedAt: new Date()})
        setResults([])
        if(inputRef.current){

            inputRef.current.value ="";
        }
    }
    return(
        <div>
            <input  className="w-full p-2 border border-gray-400 rounded-md" type="text" 
            placeholder="search for your city" ref={inputRef} onChange={handleSearch} />
            {results.length > 0 &&
            <div className="flex flex-col gap-2 border border-gray-300 rounded-md p-2">
                {results.map((result)=>(
                    <div onClick={() => handlAddCityClick(result)} className="hover:bg-gray-100 cursor-pointer p-2 rounded-md" key={result.id}>{result.name}</div>
                ))}

            </div>}

        </div>
    )
}

export default SearchCity