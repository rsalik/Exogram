import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './routes/Home';
import TicTablePage from './routes/TicTablePage';
import './styles/style.scss';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/table" element={<TicTablePage />} />
      </Routes>
    </Router>
  );
}

export default App;
