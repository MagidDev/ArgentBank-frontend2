import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AppRoutes from './Routes.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
