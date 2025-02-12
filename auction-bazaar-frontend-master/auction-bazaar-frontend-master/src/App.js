import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateAuction from './pages/CreateAuction';
import Auction from './pages/Auction';
import { AuthContext } from './context/AuthContext';
import EditProfile from "./pages/EditProfile.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import EditAuctionForm from "./components/EditAuctionForm.jsx"; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Admin from './pages/Admin.jsx';
import AEditAuctionForm from './components/AEditAuctionForm.jsx';
import AEditProfile from './components/AEditProfile.jsx';

function ProtectedRoute({ element }) {
    const { loggedIn } = useContext(AuthContext);
    return loggedIn ? element : <Login />;
}

function App() {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // Track login state

  // Optionally, check localStorage for saved login state (if necessary)
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
        setIsAdminLoggedIn(true);
    }
  }, []);
  function AProtectedRoute({ element }) {
    return isAdminLoggedIn ? element : <Admin />;
}
    return (
        <>
            <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/auction" element={<Auction />} />
                <Route path="/admin" element={<Admin />} />
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                <Route path="/createauction" element={<ProtectedRoute element={<CreateAuction />} />} />
                <Route path="/editauction/:id" element={<ProtectedRoute element={<EditAuctionForm />}/>} />
                <Route path="/aeditauction/:id" element={<AProtectedRoute element={<AEditAuctionForm />}/>} />
                <Route path="/aeditprofile" element={<AProtectedRoute element={<AEditProfile />}/>} />
                <Route path="/editprofile" element={<ProtectedRoute element={<EditProfile />}/>} />
                <Route path="/resetpassword" element={<ProtectedRoute element={<ResetPassword />}/>} />
            </Routes>
        </Router>
        <ToastContainer />
        </>
    );
}

export default App;
