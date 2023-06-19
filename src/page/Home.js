import React,{useState, useEffect} from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function fetchData_jay(city, year) {
    const endPoint =
      "http://apis.data.go.kr/B552061/jaywalking/getRestJaywalking";
    const serviceKey =
      "bRXvGfPFqaKAt4g0bX4hMi31yLKjJGsTKY0gkDEs5VDmSKDuqcGCvBb2hRh4gDuimUQ4XijFIYXwYTLo7gsidA%3D%3D";
    const type = "json";
    const numOfRows = 10;
    const pageNo = 1;
  
    const promise_jay = fetch(
      `${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`
    ).then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    });

    return promise_jay;
  }

  function fetchData_old(city, year){
    const endPoint = "http://apis.data.go.kr/B552061/frequentzoneOldman/getRestFrequentzoneOldman"
    const serviceKey = "vHN3CmQObdz9uQeokvcdspXwOzoQdbGAFdD2VOnD6YX%2BtyCoBz5IJsZJd6obmtIXgnoNwl3BWRQXU3RFbUChnw%3D%3D"
    const type ='json';
    const numOfRows=10;
    const pageNo=1;
    const promise_old = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
     .then((res)=>{
      if(!res.ok){
        throw res;
      }
      return res.json();
     })
  
     return promise_old;
  }

  function fetchData_bicycle(city, year){
    const endPoint =
    "http://apis.data.go.kr/B552061/frequentzoneBicycle/getRestFrequentzoneBicycle";
  const serviceKey =
    "CrOh%2FMB81HKw7N499livS0S7b8f6yqeJlvFpDzmjhPr8a7HVkD%2BXB%2Bq96iiK7xQNuf%2FUmvIofCxXYBimO0TgXA%3D%3D";
    const type ='json';
    const numOfRows=10;
    const pageNo=1;
    const promise_bicycle = fetch(`${endPoint}?serviceKey=${serviceKey}&searchYearCd=${year}&siDo=${city.siDo}&guGun=${city.goGun}&type=${type}&numOfRows=${numOfRows}&pageNo=${pageNo}`)
     .then((res)=>{
      if(!res.ok){
        throw res;
      }
      return res.json();
     })
  
     return promise_bicycle;
  }


export default function Home({city, year}){
    const [data, setData] = useState(null);
    const [old_data, setOld_data] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [bicycle_data, setBicycle_data] = useState(null);

    useEffect(() => {
        setIsLoaded(false);
        setError(null);
    
        // fetchData_jay(city, year)
        //   .then((data) => {
        //     setData(data);
        //     // console.log(data)
        //   })
        //   .catch((error) => {
        //     setError(error);
        //   })
          

        // fetchData_old(city, year)
        // .then((old_data) => {
        //     setOld_data(old_data);
        //     // console.log(old_data)
        //   })
        //   .catch((error) => {
        //     setError(error);
        //   })

        // fetchData_bicycle(city, year)
        //     .then((bicycle_data) => {
        //     setBicycle_data(bicycle_data);
        //   })
        //   .catch((error) => {
        //     setError(error);
        //   })
        //   .finally(() => setIsLoaded(true)); 
        
        Promise.all([fetchData_jay(city,year), fetchData_old(city,year),fetchData_bicycle(city,year)])
            .then(([d1, d2, d3])=>{
                setData(d1);
                setOld_data(d2);
                setBicycle_data(d3);
            })
            .catch((error)=>{
                setError(error);
            })
            .finally(()=> setIsLoaded(true))
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
            {year}년 {city.name} 사고조회 결과
          </h1>
          {(data.totalCount > 0||old_data.totalCount>0||bicycle_data.totalCount>0) ? (
            <>
              <Rechart accidents = {data.items.item} accidents2 = {old_data.items.item} accidents3={bicycle_data.items.item}/>
            </>
          ) : (
            <p>자료가 없습니다</p>
          )}
        </>
      );
}


    const COLORS = ["#0088FE", "#00C49F", '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };

function Rechart({accidents, accidents2, accidents3}){
    var total_occrrnc_count=0;
    var total_occrrnc_count2=0;
    var total_occrrnc_count3=0;

    accidents.map(accident =>{
        total_occrrnc_count+=accident.occrrnc_cnt;
    })

    accidents2.map(accident=>{
        total_occrrnc_count2+=accident.occrrnc_cnt;
    })
    accidents3.map(accident=>{
        total_occrrnc_count3+=accident.occrrnc_cnt;
    })

    const data =[
        {name:"A", value : total_occrrnc_count},
        {name:"B", value : total_occrrnc_count2},
        {name:"C", value : total_occrrnc_count3}
    ]
    return(
        <div style={{height:"350px"}}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            
            </PieChart>
        
        </ResponsiveContainer>
        <div className="total_count_wrap">
            <p className="Oldman_total">
                보행노인사고:{data[1].value}
            </p>
            <p className="Jaywalk_total">
                보행자무단횡단사고:{data[0].value}
            </p>
            <p className="Bicycle_total">
                자전거사고:{data[2].value}
            </p>
        </div>
      </div>
    )
}