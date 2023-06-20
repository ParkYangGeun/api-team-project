import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom'
import Jaywalking from './Jaywalking';
import Old_dashboard from './Old_dashboard'
import Home from './page/Home';
import Bicycle from './Bicycle';
import Notfound from './page/Notfound';

const seoul = [
  {id:1, siDo: 11, goGun: 680, name: '강남구' },
  {id:7, siDo: 11, goGun: 740, name: '강동구' },
  {id:8, siDo: 11, goGun: 305, name: '강북구' },
  {id:9, siDo: 11, goGun: 500, name: '강서구' },
  {id:10, siDo: 11, goGun: 620, name: '관악구' },
  {id:11, siDo: 11, goGun: 215, name: '광진구' },
  {id:12, siDo: 11, goGun: 530, name: '구로구' },
  {id:4, siDo: 11, goGun: 545, name: '금천구' },
  {id:13, siDo: 11, goGun: 350, name: '노원구' },
  {id:14, siDo: 11, goGun: 320, name: '도봉구' },
  {id:15, siDo: 11, goGun: 230, name: '동대문구' },
  {id:16, siDo: 11, goGun: 590, name: '동작구' },
  {id:2, siDo: 11, goGun: 440, name: '마포구' },
  {id:17, siDo: 11, goGun: 410, name: '서대문구' },
  {id:18, siDo: 11, goGun: 650, name: '서초구' },
  {id:19, siDo: 11, goGun: 200, name: '성동구' },
  {id:20, siDo: 11, goGun: 290, name: '성북구' },
  {id:21, siDo: 11, goGun: 170, name: '송파구' },
  {id:22, siDo: 11, goGun: 470, name: '양천구' },
  {id:5, siDo: 11, goGun: 560, name: '영등포구' },
  {id:6, siDo: 11, goGun: 170, name: '용산구' },
  {id:25, siDo: 11, goGun: 380, name: '은평구' },
  {id:3, siDo: 11, goGun: 110, name: '종로구' },
  {id:23, siDo: 11, goGun: 140, name: '중구' },
  {id:24, siDo: 11, goGun: 260, name: '중랑구' },
]

const years=[2020, 2019, 2018];

export default function App(){
  const [year, setYear] = useState(years[0]);
  const [city, setCity] = useState(seoul[0]);

  return(
    <Router>
      <nav>
        <Link to="/">
          <div className='home_btn'>
          <svg className='home_logo' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M380.8 416c41.5-40.7 67.2-97.3 67.2-160C448 132.3 347.7 32 224 32S0 132.3 0 256S100.3 480 224 480H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H380.8zM224 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192zm64 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/></svg>Home
          </div>
        </Link>
        
        <ul className='nav_li_wrap'>
          <li className='nav_li'>
            <Link to="/old_dashboard">
              <h2>
              보행노인사고조회서비스
              </h2>
            </Link>
          </li>
          <li className='nav_li'>
            <Link to="/jaywalking">
              <h2>
              보행자무단횡단사고조회서비스
              
              </h2>
            </Link>
          </li>
          <li className='nav_li'>
            <Link to="/bicycle">
              <h2>
              자전거사고조회서비스
              
              </h2>
            </Link>
          </li>
        </ul>
        
        <section>
          <h3>서울</h3>
          <div className='city_btn_wrap'>
            {seoul.map(city =>(
              <button
                className='city_select_btn'
                key={city.id}
                onClick={()=>setCity(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
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
        <Routes>
          <Route path ="/" element={<Home city={city} year={year}/>}></Route>
          <Route path="/old_dashboard" element={<Old_dashboard city={city} year={year}/>}></Route>
          {/* <Old_dashboard city={city} year={year}/> */}
          <Route path="/jaywalking" element={<Jaywalking city={city} year={year} />}></Route>
          <Route path="/bicycle" element={<Bicycle city={city} year={year} />}></Route>
          <Route path="/*" element={<Notfound />}></Route>
        </Routes>
      </main>
    </Router>
  )
}
