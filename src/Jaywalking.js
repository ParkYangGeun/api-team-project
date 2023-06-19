import React, { useState, useEffect } from "react";

import { Map, MapMarker, MapInfoWindow } from "react-kakao-maps-sdk";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
function fetchData(city, year) {
    const endPoint =
      "http://apis.data.go.kr/B552061/jaywalking/getRestJaywalking";
    const serviceKey =
      "bRXvGfPFqaKAt4g0bX4hMi31yLKjJGsTKY0gkDEs5VDmSKDuqcGCvBb2hRh4gDuimUQ4XijFIYXwYTLo7gsidA%3D%3D";
    const type = "json";
    const numOfRows = 10;
    const pageNo = 1;
  
    const promise = fetch(
      `${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`
    ).then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    });
    return promise;
  }

  export default function Jaywalking({ city, year }) {
    const [data, setData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
      setIsLoaded(false);
      setError(null);
  
      fetchData(city, year)
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setIsLoaded(true));
    }, [city, year]);
  
    if (error) {
      return <p>failed to fetch</p>;
    }
  
    if (!isLoaded) {
      return <p>fetching data...</p>;
    }
    return (
      <>
        <h1>
          {year}년 {city.name} 무단횡단 사고조회 결과
        </h1>
        {data.totalCount > 0 ? (
          <>
            <Rechart accidents={data.items.item} city={city} />
            <KakaoMap accidents={data.items.item} />
          </>
        ) : (
          <p>자료가 없습니다</p>
        )}
      </>
    );
  }
  
  function Rechart({ accidents, city }) {
    var total_occrrnc_count = 0;
    const chartData = accidents.map((accidents) => {
      var x = accidents.spot_nm.split(" ");
      // spot_nm : 다발지역 지점의 위치
      
      var r = x.slice(2).join(" ");
      total_occrrnc_count+=accidents.occrrnc_cnt;
      return {
        name: r,
        발생건수: accidents.occrrnc_cnt,
        사망자수: accidents.dth_dnv_cnt,
        중상자수: accidents.se_dnv_cnt,
      };
    });
  
    return (
      <div style={{ height: "350px"}} >
        <ResponsiveContainer width="100%" height="90%" debounce={1}>
          <BarChart
            width={500}
            height={250}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={<CustomizedTick chartData={chartData} />}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="발생건수" fill="rgb(45 212 191)" />
            <Bar dataKey="사망자수" fill="rgb(14 165 233)" />
            <Bar dataKey="중상자수" fill="rgb(239 68 68)" />
          </BarChart>
        </ResponsiveContainer>
        <div className='total_accident_count' style={{textAlign:"center"}}>
            {city.name} 총 사고 발생건수 : {total_occrrnc_count}
        </div>
      </div>
    );
  }
  
  function CustomizedTick(props) {
    const { x, y, stroke, payload } = props;
  
    // let m = payload.value.match(/\((.*?)\)/);
    const m = payload.value.split("(")[0];
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fill="#666">
          <tspan textAnchor="middle" x="0" z-index={10} >
          {m}
          </tspan>
        </text>
      </g>
    );
  }
  
  const KakaoMap = ({ accidents }) => {
    const locations = accidents.map((acc) => {
      return {
        title: acc.spot_nm,
        latlng: { lat: Number(acc.la_crd), lng: Number(acc.lo_crd) },
      };
    });
  
    return (
      <Map
        center={{ lat: accidents[0].la_crd, lng: accidents[0].lo_crd }}
        style={{ width: "90%", height: "400px", margin:"0 auto"  }}
        level={5}
      >
        {locations.map((loc, idx) => (
          <MapMarker
            key={`${loc.title}-${loc.latlng}`}
            position={loc.latlng}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              size: { width: 24, height: 35 },
            }}
            title={loc.title}
            >
                <div style = {{padding: "5px", color:"#000"}}>
                    {loc.title.split(' ')[2]}
                </div>
            </MapMarker>
        ))}
      </Map>
    );
  };
  