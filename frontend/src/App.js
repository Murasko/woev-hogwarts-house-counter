import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './HousesList.css';

function HousesList() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/houses');
        setHouses(response.data);
      } catch (error) {
        console.error('Failed to fetch houses:', error);
      }
    };

    fetchHouses();
  }, []);

  const incrementPoints = async (id, pointsToAdd = 1) => {
    try {
      await axios.post(`http://localhost:3000/houses/${id}/points`, { points: pointsToAdd });
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
      await axios.post(`http://localhost:3000/houses/${id}/points`, { points: -pointsToSubtract });
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
    <div className="houses-list">
      <h2>Hogwarts Houses</h2>
      <ul>
        {houses.map(house => (
          <li key={house.id} className="house-item">
            <span className="house-name">{house.name}: {house.points} points</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const AdminView = () => (
    <div className="houses-list">
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
        <Route path="*" element={<ListView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default HousesList;