import React, { useState, useContext, useEffect, useRef } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom'
import Jaywalking from './Jaywalking';
import Old_dashboard from './Old_dashboard'
import Home from './page/Home';
import Bicycle from './Bicycle';

const seoul = [
  {id:1, siDo: 11, goGun: 680, name: '강남구' },
  {id:2, siDo: 11, goGun: 440, name: '마포구' },
  {id:3, siDo: 11, goGun: 110, name: '종로구' }
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
        
        <ul>
          <li className='nav_li'>
            <Link to="/old_dashboard">
              <h2>
              보행노인사고다발지역정보서비스
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
        </Routes>
      </main>
    </Router>
  )
}
