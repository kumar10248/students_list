import { useEffect, useState } from "react";
import "./Home.css";
import defaultProfilePicture from "../assets/defaultProfilePicture.png";
import axios from "axios";
import { Digital } from "react-activity";
import "react-activity/dist/Digital.css";
import * as XLSX from "xlsx";

const Home = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [sectionText, setSectionText] = useState<string>("");
  const [groupText, setGroupText] = useState<string>("");
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(
        "https://students-list-backend.onrender.com/all"
      );
      setData(res.data.student);
      const initialAttendance = res.data.student.reduce(
        (acc: any, student: any) => {
          acc[student.uid] = true; // All students marked as present initially
          return acc;
        },
        {}
      );
      setAttendance(initialAttendance);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAttendance = (uid: string) => {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [uid]: !prevAttendance[uid],
    }));
  };

  const handleSearch = () => {
    const filtered = data.filter(
      (student: any) =>
        (student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.uid.toLowerCase().includes(searchText.toLowerCase()) ||
          student.section.toLowerCase().includes(searchText.toLowerCase())) &&
        student.section.toLowerCase().includes(sectionText.toLowerCase()) &&
        student.group.toLowerCase().includes(groupText.toLowerCase())
    );
    setFilteredData(filtered);
    setHasSearched(true);
  };

  const exportToExcel = () => {
    const attendanceData = filteredData.map((student: any) => ({
      UID: student.uid,
      Name: student.name,
      Section: student.section,
      Group: student.group,
      Batch: student.batch,
      Status: attendance[student.uid] ? "Present" : "Absent",
    }));

    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "Attendance.xlsx");
  };

  return (
    <>
      <div className="home">
        <header>
          <h1>Efficient Attendance Marking Solution</h1>
          <h2>for Chandigarh University's 3rd Year General CSE Program</h2>
        </header>
      </div>

      <div className="search-container">
        <input
          className="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          placeholder="Search by name, UID, or section"
        />
        <input
          className="search"
          value={sectionText}
          onChange={(e) => setSectionText(e.target.value)}
          type="text"
          placeholder="Filter by section"
        />
        <input
          className="search"
          value={groupText}
          onChange={(e) => setGroupText(e.target.value)}
          type="text"
          placeholder="Filter by group"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>
      <button onClick={exportToExcel} className="export-btn">
        Export to Excel
      </button>
      {!loading ? (
        <div className={`main ${!hasSearched ? "hidden" : ""}`}>
          {filteredData.length > 0 ? (
            filteredData.map((student: any, index: any) => (
              <div className="stcard" key={index}>
                <img
                  src={defaultProfilePicture}
                  alt={`${student.name}'s profile`}
                  className="profile-picture"
                />
                <div className="name">{student.name}</div>
                <div>UID: {student.uid}</div>
                <div>Section: {student.section}</div>
                <div>Group: {student.group}</div>
                <div>Batch: {student.batch}</div>
                <div>
                  <button
                    className="but"
                    onClick={() => handleAttendance(student.uid)}
                    style={{
                      backgroundColor: attendance[student.uid]
                        ? "#28a745"
                        : "#dc3545",
                    }}
                  >
                    {attendance[student.uid] ? "Present" : "Absent"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            hasSearched && <div>No students found</div>
          )}
        </div>
      ) : (
        <Digital color="#28a745" size={32} speed={1} animating={true} />
      )}
    </>
  );
};

export default Home;
