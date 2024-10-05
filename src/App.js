import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Product from './components/pages/Products';
import Contact from './components/pages/Contact';
import './App.css';
import EWasteIdentification from './components/EWasteIdentification';
import IncentiveSubmission from './components/IncentivePoints';

const App = () => {
  return (
    /*<Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>*/ <IncentiveSubmission/>
  );
};

export default App;
