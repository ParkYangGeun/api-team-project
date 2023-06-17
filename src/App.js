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
import {Map, MapMarker, MapInfoWindow} from 'react-kakao-maps-sdk';

const apiKey="221d085dfdb608ad8a95134f0e47c3b7"
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
    if(!res.ok){
      throw res;
    }
    return res.json();
   })

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
  
  useEffect(() => {

    // 서버에 요청하기 전 사용자에게 대기 상태를 먼저 보여주어야 한다
    setIsLoaded(false); 
    setError(null);

    

      // fetchData함수에 city와 year 변수를 전달한다
      fetchData(city, year)
        .then(data => {
          console.log(data)
          setData(data);
        })
        .catch(error => {
          setError(error);
        })
        .finally(() => setIsLoaded(true)); // 성공 실패와 관계없이 서버가 응답하면 대기상태를 해제한다

  }, [city, year])

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
          <KakaoMap accidents= {data.items.item} />
        </>
      ) : (
        <p>자료가 없습니다</p>
      )}

    </>

  )
}

function Rechart({accidents}){

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

  return(
    <div style={{height:"350px"}}>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={250}
          data ={chartData}
          margin={{top:5, right:30, left:20, bottom:5}}
          
        >
          <CartesianGrid strokeDasharray = "3 3" />
          <XAxis dataKey="name" tick={<CustomizedTick chartData={chartData} />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="발생건수" fill="rgb(45 212 191)" />
          <Bar dataKey="사상자수" fill="rgb(14 165 233)" />
          <Bar dataKey="중상자수" fill="rgb(239 68 68)" />

        </BarChart>

      </ResponsiveContainer>
    </div>
  )
}

function CustomizedTick(props) {
  const { x, y, stroke, payload } = props;

  console.log("payload.value : "+payload.value);
  const m = payload.value.split("(")[0];
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} fill="#666">
        <tspan textAnchor="middle" x="0" z-index={10} >
        {m}
        </tspan>
      </text>
    </g>
  )
}

function KakaoMap({ accidents }) {

  // MapInfoWindow 컴포넌트를 재사용한다
  const mapInfoWindows = accidents.map(accident => (
    <MapInfoWindow
      key={accident.la_crd}
      position={{ lat: accident.la_crd, lng: accident.lo_crd }}
      removable={true}
    >
      <div style={{ padding: "5px", color: "#000" }}>
        {accident.spot_nm.split(' ')[2]}
      </div>
    </MapInfoWindow>
  ))
  return (
    <Map
      center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }}
      style={{ width: "90%", height: "400px" }}
      level={5}
    >
      {mapInfoWindows}
    </Map>
  )
}
