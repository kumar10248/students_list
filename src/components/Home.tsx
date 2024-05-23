import { useEffect, useState } from 'react';
import './Home.css';
import defaultProfilePicture from '../assets/defaultProfilePicture.png';
import axios from 'axios';
import { Digital } from 'react-activity';
import 'react-activity/dist/Digital.css';
import * as XLSX from 'xlsx';

const Home = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get('https://students-list-backend.onrender.com/all');
      setData(res.data.student);
      const initialAttendance = res.data.student.reduce((acc: any, student: any) => {
        acc[student.uid] = true; // All students marked as present initially
        return acc;
      }, {});
      setAttendance(initialAttendance);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAttendance = (uid: string) => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [uid]: !prevAttendance[uid],
    }));
  };

  const exportToExcel = () => {
    const attendanceData = searchData.map((student: any) => ({
      UID: student.uid,
      Name: student.name,
      Section: student.section,
      Group: student.group,
      Batch: student.batch,
      Status: attendance[student.uid] ? 'Present' : 'Absent',
    }));

    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'Attendance.xlsx');
  };

  const searchData = data.filter((student: any) =>
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.section.toLowerCase().includes(searchText.toLowerCase()) ||
    student.uid.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <div className='sr'>
        <input className='search' value={searchText} onChange={(e) => { setSearchText(e.target.value) }} type="text" placeholder="Search by name, section, or UID" />
      </div>
      <button onClick={exportToExcel} className="export-btn">Export to Excel</button>
      {!loading ? (
        <div className='main'>
          {searchData.map((student: any, index: any) => (
            <div className='stcard' key={index}>
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
              <div>
                <button
                  className="but"
                  onClick={() => handleAttendance(student.uid)}
                  style={{ backgroundColor: attendance[student.uid] ? '#28a745' : '#dc3545' }}
                >
                  {attendance[student.uid] ? 'Present' : 'Absent'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Digital color="#28a745" size={32} speed={1} animating={true} />
      )}
    </>
  );
};

export default Home;
