import React, { useState, useContext, useEffect, useRef } from "react";

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
    "http://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle";
  const serviceKey =
    "CrOh%2FMB81HKw7N499livS0S7b8f6yqeJlvFpDzmjhPr8a7HVkD%2BXB%2Bq96iiK7xQNuf%2FUmvIofCxXYBimO0TgXA%3D%3D";
  const type = "json";
  const numOfRows = 10;
  const pageNo = 1;

  // 자바스크립트에 내장된 fetch() 메서드를 사용하여 서버에 요청한다
  const promise = fetch(
    `${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`
  ).then((res) => {
    // 서버의 응답코드(status)가 200(성공)이 아닌 경우 catch 블록에 응답 객체를 던진다
    if (!res.ok) {
      throw res;
    }
    // 서버의 응답코드가 200인 경우 응답객체(프로미스 객체)를 리턴한다
    return res.json();
  });

  return promise;
}

export default function Bicycle({ city, year }) {
  const [data, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 서버에 요청하기 전 사용자에게 대기 상태를 먼저 보여주어야 한다
    setIsLoaded(false);
    setError(null);

    // fetchData함수에 city와 year 변수를 전달한다
    fetchData(city, year)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setIsLoaded(true)); // 성공 실패와 관계없이 서버가 응답하면 대기상태를 해제한다
  }, [city, year]); // city 또는 year 변수가 업데이트되면 서버에 다시 데이터를 요청한다

  if (error) {
    return <p>failed to fetch</p>;
  }

  if (!isLoaded) {
    return <p>fetching data...</p>;
  }
  return (
    <>
      <h1>
        {year}년 {city.name} 자전거 사고조회 결과
      </h1>
      {data.totalCount > 0 ? (
        <>
          {/* DATA를 합성된 컴포넌트에 전달한다 */}
          <Rechart accidents={data.items.item} city={city}/>
          <KakaoMap accidents={data.items.item} />
        </>
      ) : (
        // 데이터가 없으면 사용자에게 자료가 없다는 것을 알려야 한다
        <p>자료가 없습니다.</p>
      )}
    </>
  );
}


// 리차트 (리액트 차트 라이브러리)
function Rechart({ accidents, city }) {
    var total_occrrnc_count = 0;
    

  // 리차트가 요구하는 형식에 맞게 데이터를 구성한다
  const chartData = accidents.map((accident) => {
    var n= accident.spot_nm.split(" ")[2];
    var na = n.split("(")[0];
    total_occrrnc_count+=accident.occrrnc_cnt;
    return {
      na:na,
      name: n,
      발생건수: accident.occrrnc_cnt,
      중상자수: accident.se_dnv_cnt,
      사망자수: accident.dth_dnv_cnt,
    };
  });
  
  const {data, tooltipForm} = {chartData};
  return (
    <div style={{ height: "350px" }}>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={250}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="na" tick={<CustomizedTick chartData={chartData} />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="발생건수" fill="rgb(45 212 191)" />
          <Bar dataKey="중상자수" fill="rgb(14 165 233)" />
          <Bar dataKey="사망자수" fill="rgb(239 68 68)" />
        </BarChart>
      </ResponsiveContainer>
      <div className='total_accident_count' style={{textAlign:"center"}}>
            {city.name} 총 사고 발생건수 : {total_occrrnc_count}
        </div>
    </div>
  );
}




function CustomizedTick(props) {
  const { x, y, payload } = props;

  // console.log("payload.value : "+payload.value);
  const m = payload.value;
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
// 카카오 지도
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