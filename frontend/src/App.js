import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './css/AdminView.css';
import './css/ListView.css';

function HousesList() {
  const [houses, setHouses] = useState([]);

  // Simulate fetching houses data
  const fetchHouses = async () => {
    // Replace this with your actual fetch call
    try {
      const response = await axios.get('http://localhost:3001/houses');
      setHouses(response.data);
    } catch (error) {
      console.error('Failed to fetch houses:', error);
    }
  };

  useEffect(() => {
    fetchHouses(); // Fetch immediately on mount
    const interval = setInterval(fetchHouses, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const incrementPoints = async (id, pointsToAdd = 1) => {
    try {
      await axios.post(`http://localhost:3001/houses/${id}/points`, { points: pointsToAdd });
      const updatedHouses = houses.map(house => {
        if (house.id === id) {
          return { ...house, points: house.points + pointsToAdd };
        }
        return house;
      });
      setHouses(updatedHouses);
    } catch (error) {
      console.error('Failed to update points:', error);
      // Optionally, handle the error (e.g., show an error message to the user)
    }
  };
  
  const decrementPoints = async (id, pointsToSubtract = 1) => {
    try {
      await axios.post(`http://localhost:3001/houses/${id}/points`, { points: -pointsToSubtract });
      const updatedHouses = houses.map(house => {
        if (house.id === id) {
          return { ...house, points: house.points - pointsToSubtract };
        }
        return house;
      });
      setHouses(updatedHouses);
    } catch (error) {
      console.error('Failed to update points:', error);
      // Optionally, handle the error (e.g., show an error message to the user)
    }
  };

  const ListView = () => (
    <div className='bg'>
      <div className="points-container">
        {houses.map((house, index) => {
          // Define positions for each of the 4 houses
          const positions = [
            { top: '63%', right: '34%' }, // Gryffindor
            { top: '63%', right: '15%' }, // Hufflepuff
            { top: '63%', left: '46%' }, // Ravenclaw
            { top: '63%', left: '27%' } // Slytherin
          ];
  
          // Assign a position to each house based on its index
          const positionStyle = positions[index % positions.length]; // Ensure it works even if there are more than 4 houses
  
          return (
            <div 
              key={house.id} 
              className={`house-point`}
              style={{
                ...positionStyle, // Spread the position styles here
              }}
            >
              {house.points}
            </div>
          );
        })}
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="houses-admin">
      <h2>Hogwarts Houses</h2>
      <ul>
        {houses.map(house => (
          <li key={house.id} className="house-item">
            <span className="house-name">{house.name}: {house.points} points</span>
            <div className="button-group">
              <button onClick={() => incrementPoints(house.id)}>+</button>
              <button onClick={() => decrementPoints(house.id)}>-</button>
              <button onClick={() => incrementPoints(house.id, 5)}>+5</button>
              <button onClick={() => decrementPoints(house.id, 5)}>-5</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminView />} />
        <Route path="*" element={<ListView />} />
      </Routes>
    </Router>
  );
}

export default HousesList;