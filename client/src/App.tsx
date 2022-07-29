import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/Header';
import { auth } from './handlers/firebase';
import DictionaryPage from './routes/DictionaryPage';
import Home from './routes/Home';
import PageNotFound from './routes/PageNotFound';
import ProfilePage from './routes/ProfilePage';
import SignInPage from './routes/SignInPage';
import TicChartsPage from './routes/TicChartsPage';
import { TicPage } from './routes/TicPage';
import TicTablePage from './routes/TicTablePage';
import './styles/style.scss';

export const UserContext = React.createContext<User | null>(null);

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged(
      (user) => {
        setUser(user);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Header />
        <div className="content-wrapper">
          <div>
            <Routes>
              <Route index element={<Home />} />
              <Route path="table" element={<TicTablePage />}>
                <Route path=":group" element={<TicTablePage />} />
              </Route>
              <Route path="charts" element={<TicChartsPage />}>
                <Route path=":ticIds" element={<TicChartsPage />} />
              </Route>
              <Route path="dictionary" element={<DictionaryPage />} />
              <Route path="tic/:ticId" element={<TicPage />} />
              <Route path="signin" element={<SignInPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
