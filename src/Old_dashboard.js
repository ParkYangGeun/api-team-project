import React, { useState, useContext, useEffect, useRef } from 'react';
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

export default function Old_dashboard({city, year}){

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
            // console.log(data)
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

    // console.log("item : "+data.items.item);
  
    return(
      <>
        <h1>{year}년 {city.name} 보행노인 사고다발지역</h1>
        {data.totalCount>0?(
          <>
            <Rechart accidents = {data.items.item} city={city} />
            <KakaoMap accidents= {data.items.item} />
          </>
        ) : (
          <p>자료가 없습니다</p>
        )}
  
      </>
    )
  }
  function Rechart({accidents, city}){
      var total_occrrnc_count = 0;

    const chartData = accidents.map(accident=>{
      var x= accident.spot_nm.split(' ');
        
      var r = x.slice(2).join(" ");
        total_occrrnc_count+=accident.occrrnc_cnt;
        
      return{
        name : r,
        발생건수 : accident.occrrnc_cnt,
        사상자수 : accident.caslt_cnt,
        중상자수 : accident.se_dnv_cnt,
      }
    })
//   console.log("city_name : " +{city})
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
        <div className='total_accident_count' style={{textAlign:"center"}}>
            {city.name} 총 사고 발생건수 : {total_occrrnc_count}
        </div>
      </div>
      
    )
  }
  
  function CustomizedTick(props) {
    const { x, y, stroke, payload } = props;
  
    // console.log("payload.value : "+payload.value);
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
        style={{ width: "90%", height: "400px", margin:"0 auto"  }}
        level={5}
      >
        {mapInfoWindows}
      </Map>
    )
  }
  