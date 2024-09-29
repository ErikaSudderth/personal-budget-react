import React, { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import Menu from "./Menu/Menu";
import Hero from "./Hero/Hero";
import HomePage from "./HomePage/HomePage";
import Footer from "./Footer/Footer";
import AboutPage from "./AboutPage/AboutPage";
import LoginPage from "./LoginPage/LoginPage";

function App() {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/budget");
        setBudgetData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching budget data: {error.message}</div>;

  return (
    <Router>
      <Menu />
      <Hero />
      <div className="mainContainer">
        <Routes>
          <Route
            path="/"
            element={<HomePage budgetData={budgetData} />}
          ></Route>
          <Route path="/about" element={<AboutPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
