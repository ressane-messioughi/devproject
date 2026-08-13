import { Route, Routes } from 'react-router';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import IndexPage from './pages/IndexPage.jsx';
import AppHomePage from './pages/app/AppHomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AppTeamsPage from './pages/app/AppTeamsPage.jsx';
import PrivateRoute from './hooks/PrivateRoute.jsx';
import AppProjectPage from './pages/app/AppProjectPage.jsx';
import AppProfilePage from './pages/app/AppProfilePage.jsx';
import AppJournalPage from './pages/app/AppJournalPage.jsx';
import AppBugsPage from './pages/app/AppBugsPage.jsx';
import JoinProjectPage from './pages/JoinProjectPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import './index.css';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<DashboardLayout />}>
          <Route
            path="/me"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <AppProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/panel"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <AppHomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/team"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <AppTeamsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <AppProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <AppJournalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/bug"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <AppBugsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/join/:team_code"
            element={
              <PrivateRoute roles={['ADMIN', 'USER']}>
                <JoinProjectPage />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AnimatePresence>
  );
}
export default App;
