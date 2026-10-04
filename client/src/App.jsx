import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import DemoBanner from './components/common/DemoBanner';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import MapPage from './pages/MapPage';
import QueryPage from './pages/QueryPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { demoAPI } from './services/api';
import './index.css';

export default function App() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    checkDemoStatus();
  }, []);

  async function checkDemoStatus() {
    try {
      const res = await demoAPI.status();
      setIsDemo(res.active);
    } catch (err) {
      // Server not running yet — that's OK
    }
  }

  function handleDemoStart() {
    setIsDemo(true);
  }

  return (
    <Router>
      <div className={`app-shell ${isDemo ? 'has-demo-banner' : ''}`}>
        <DemoBanner active={isDemo} />
        <Header isDemo={isDemo} />

        <main style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage onDemoStart={handleDemoStart} />} 
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/incident/:id" element={<IncidentDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/ask" element={<QueryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
