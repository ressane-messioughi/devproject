import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import ProjectProvider from './context/ProjectProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './socket.js';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          toastClassName="!bg-[#2d3748] !border !border-white/10 !rounded-xl !shadow-xl"
          bodyClassName="!text-white"
        />
        <App />
      </ProjectProvider>
    </AuthProvider>
  </BrowserRouter>,
);
