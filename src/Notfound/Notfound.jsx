import React from 'react';
import imgerror from '../0_VMeYq1x7s1ObI0Sq.gif';
import { NavLink } from 'react-router-dom';



export default function Notfound() {
 
  return (
    <div className=' bg-white  bg-black container-fluid text-center vh-100 d-flex flex-column justify-content-center align-items-center position-relative'>

  
      <div  style={{ maxWidth: '160%', width: '800px' }}>
        <img src={imgerror} alt="error" style={{ maxWidth: '160%', width: '800px' }}  loading='lazy'/>
      </div>

    
      <p className='fs-3  goto text-black '>This page is not found</p>

      < NavLink to={'/HomePage'}>  <button className='btn goto  bg-light   btn-lg'>Go to Home  </button></NavLink>
    </div>
  );
}