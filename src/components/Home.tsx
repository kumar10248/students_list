import  { useEffect, useState } from 'react';
import './Home.css';

import defaultProfilePicture from '../assets/defaultProfilePicture.png';
import axios from 'axios';
import { Digital } from 'react-activity';
import  'react-activity/dist/Digital.css';

const Home = () => {
 const [searchText,setSearchText]=useState<string>('');
 const [data,setData]=useState<any>([])
 const[loading,setLoading]=useState<boolean>(false);
useEffect(()=>{
  const fetchData= async()=>{
    setLoading(true);
    const res = await axios.get('https://students-list-backend.onrender.com/all');
  setData(res.data.student);
  setLoading(false);

  }

fetchData();
},[]);   


const searchData = data.filter((student:any)=>
student.name.toLowerCase().includes(searchText.toLowerCase())
|| student.section.toLowerCase().includes(searchText.toLowerCase())
||student.uid.toLowerCase().includes(searchText.toLowerCase())
)

  return (
    <>
    <div className='sr'>
      <input className='search' value={searchText} onChange={(e)=>{setSearchText(e.target.value)}} type="text" />
    </div>
   {!loading ? <div className='main'>
    
      {searchData.map((student:any, index:any) => (
        
        <div
          className='stcard'
          key={index}
          
        >
          <img
            src={defaultProfilePicture}
            alt={`${student.name}'s profile`}
            className='profile-picture'
          />
          <div className='name'>{student.name}</div>
          <div>UID: {student.uid}</div>
          <div>Section: {student.section}</div>
          <div>Group: {student.group}</div>
          <div>Batch: {student.batch}</div>
          
        </div>
      ))}
    </div>:<Digital color="#28a745" size={32} speed={1} animating={true} />}
    </>
  );
};

export default Home;
