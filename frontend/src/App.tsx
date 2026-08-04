import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import RecommendationsPage from './pages/RecommendationsPage';
import AssistantPage from './pages/AssistantPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('makeup_token');
  if (!token) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col text-sand-900">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-1"><LandingPage /></main>
                <Footer />
              </>
            }
          />
          <Route
            path="/auth"
            element={
              <>
                <Navbar />
                <main className="flex-1"><AuthPage /></main>
                <Footer />
              </>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Navbar />
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
