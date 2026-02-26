import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListing />} />
              <Route path="/jobs/:id" element={<JobDetails />} />

              {/* Protected Routes - All Authenticated Users */}
              <Route path="" element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Protected Routes - specific roles handled inside component or wrapper */}
              <Route path="" element={<ProtectedRoute allowedRoles={['jobseeker', 'admin']} />}>
                <Route path="/dashboard/jobseeker" element={<JobSeekerDashboard />} />
              </Route>

              <Route path="" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
                <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
              </Route>

              <Route path="" element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          </footer>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
