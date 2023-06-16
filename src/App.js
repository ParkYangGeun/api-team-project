import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const seoul = [
  { siDo: 11, goGun: 680, name: '강남구' },
  { siDo: 11, goGun: 440, name: '마포구' },
  { siDo: 11, goGun: 110, name: '종로구' }
]

const years=[2021, 2020, 2019];

function fetchData(city, year){
  const endPoint = "http://apis.data.go.kr/B552061/frequentzoneOldman/getRestFrequentzoneOldman"
  const serviceKey = "vHN3CmQObdz9uQeokvcdspXwOzoQdbGAFdD2VOnD6YX%2BtyCoBz5IJsZJd6obmtIXgnoNwl3BWRQXU3RFbUChnw%3D%3D"
  const type ='json';
  const numOfRows=10;
  const pageNo=1;
  const promise = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
   .then((res)=>{
     console.log(res)
    if(!res.ok){
      throw res;
    }
    return res.json();
   })
   console.log(promise);

   return promise;

}

export default function App(){
  const [year, setYear] = useState(years[0]);
  const [city, setCity] = useState(seoul[0]);

  return(
    <>
      <nav>
        <h1>
          보행노인사고다발지역정보서비스
        </h1>
        <section>
          <h3>서울</h3>
          {seoul.map(city =>(
            <button
              key={city.id}
              onClick={()=>setCity(city)}
            >
              {city.name}
            </button>
          ))}
        </section>
      </nav>

      <main>
        <div className="select-year">
          <select onChange={(e)=>setYear(e.target.value)}>
            {years.map(year=>(
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <Dashboard city={city} year={year}/>
      </main>
    </>

  )
}

function Dashboard({city, year}){

  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(()=>{

    setIsLoaded(false);
    setError(null);

    fetchData(city, year)
      .then(data =>{
        setData(data);
      })
      .catch(error=>{
        setError(error);
      })
      .finally(()=>setIsLoaded(true));
  },[city, year])

  if(error){
    return <p>failed to fetch</p>
  }

  if(!isLoaded)
  {
    return <p>fetching data...</p>
  }

  return(
    <>
      <h1>{year}년 {city.name} 보행노인 사고다발지역</h1>
      {data.totalCount>0?(
        <>
          <Rechart accidents = {data.items.item} />
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}

    </>

  )
}

function Rechart({accidents}){
  console.log(accidents);

  const chartData = accidents.map(accident=>{
    var x= accident.spot_nm.split(' ');

    var r = x.slice(2).join(" ");

    return{
      name : r,
      발생건수 : accident.occrrnc_cnt,
      사상자수 : accident.caslt_cnt,
      중상자수 : accident.se_dnv_cnt
    }
  })
  console.log(chartData)

  return(
    <div style={{height:"300px"}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data ={chartData}
          margin={{top:5, right:30, left:20, bottom:5}}
        >
          <CartesianGrid strokeDasharray = "3 3" />
          <XAxis dataKey="name" tick={<CustomizedTick chartData={chartData} />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="발생건수" fill="#0af" />
          <Bar dataKey="사상자수" fill="#fa0" />
          <Bar dataKey="중상자수" fill="#f00" />

        </BarChart>

      </ResponsiveContainer>
    </div>
  )
}

function CustomizedTick(props) {
  const { x, y, stroke, payload } = props;

  let m = payload.value.match(/\((.*?)\)/);

  console.log(m);

  console.log(props)

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fill="#666">
        <tspan textAnchor="middle" x="0">
        {payload.value.split('(')[0]}
        </tspan>
        <tspan textAnchor="middle" x="0" dy="20">
        ({m[1]})
        </tspan>
      </text>
    </g>
  )
}
