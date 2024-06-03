// src/components/CgpaCalculator.js

import React, { useState } from 'react';
import './CgpaCalculator.css';

const CgpaCalculator = () => {
  const [grades, setGrades] = useState({
    probability: '',
    dbms: '',
    os: '',
    numericalMethods: '',
    javaSpring: '',
    javaSpringLab: '',
    genderEquity: '',
    miniProject: '',
    generalProficiency: '',
  });

  const credits = {
    probability: 4,
    dbms: 4,
    os: 3,
    numericalMethods: 3,
    javaSpring: 2,
    javaSpringLab: 1,
    genderEquity: 1,
    miniProject: 1,
    generalProficiency: 1,
  };

  const handleGradeChange = (event) => {
    const { name, value } = event.target;
    setGrades({
      ...grades,
      [name]: value,
    });
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    for (const course in grades) {
      if (grades[course]) {
        const grade = parseFloat(grades[course]);
        const credit = credits[course];
        totalCredits += credit;
        totalPoints += grade * credit;
      }
    }

    return totalPoints / totalCredits;
  };

  return (
    <div className="cgpa-calculator">
      <h2>CGPA Calculator</h2>
      {Object.keys(grades).map((course) => (
        <div key={course} className="grade-input">
          <label>
            {course.charAt(0).toUpperCase() + course.slice(1).replace(/([A-Z])/g, ' $1')}:
            <input
              type="number"
              name={course}
              value={grades[course]}
              onChange={handleGradeChange}
              min="0"
              max="10"
            />
          </label>
        </div>
      ))}
      <button onClick={calculateCGPA} className="calculate-btn">Calculate CGPA</button>
      <div className="cgpa-result">
        <h3>CGPA: {calculateCGPA().toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default CgpaCalculator;
