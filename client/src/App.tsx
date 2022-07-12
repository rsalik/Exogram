import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/Header';
import DictionaryPage from './routes/DictionaryPage';
import Home from './routes/Home';
import { TicPage } from './routes/TicPage';
import TicTablePage from './routes/TicTablePage';
import './styles/style.scss';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/table" element={<TicTablePage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/tic/:ticId" element={<TicPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
