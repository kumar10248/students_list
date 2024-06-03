// src/components/CgpaCalculator.js

import React, { useState } from 'react';

const subjects = [
  { name: "Probability & Statistics", credit: 4 },
  { name: "DataBase Management System", credit: 4 },
  { name: "Operating System", credit: 3 },
  { name: "Numerical Method and Optimization using Python", credit: 3 },
  { name: "Java Spring and Microservices", credit: 2 },
  { name: "Java Spring and Microservices Lab", credit: 1 },
  { name: "Gender Equity and Empowerment", credit: 1 },
  { name: "Mini Project-1", credit: 1 },
  { name: "General Proficiency-4", credit: 1 }
];

const gradeToPoint = (grade) => {
  switch (grade.toUpperCase()) {
    case 'A+': return 10;
    case 'A': return 9;
    case 'B+': return 8;
    case 'B': return 7;
    case 'C+': return 6;
    case 'C': return 5;
    case 'D': return 4;
    case 'F': return 0;
    default: return 0;
  }
};

const CgpaCalculator = () => {
  const [grades, setGrades] = useState(Array(subjects.length).fill(''));
  const [cgpa, setCgpa] = useState(null);

  const handleChange = (index, event) => {
    const newGrades = [...grades];
    newGrades[index] = event.target.value;
    setGrades(newGrades);
  };

  const calculateCgpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade, index) => {
      const points = gradeToPoint(grade);
      const credits = subjects[index].credit;
      totalPoints += points * credits;
      totalCredits += credits;
    });

    const calculatedCgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    setCgpa(calculatedCgpa);
  };

  return (
    <div>
      <h1>CGPA Calculator</h1>
      <form onSubmit={(e) => { e.preventDefault(); calculateCgpa(); }}>
        {subjects.map((subject, index) => (
          <div key={index}>
            <label>{subject.name} (Credit: {subject.credit}): </label>
            <input
              type="text"
              value={grades[index]}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
        ))}
        <button type="submit">Calculate CGPA</button>
      </form>
      {cgpa !== null && (
        <div>
          <h2>Your CGPA is: {cgpa}</h2>
        </div>
      )}
    </div>
  );
};

export default CgpaCalculator;
