import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Admin = () => {
  // State to manage login details and admin status
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track if the user is logged in as admin
  const [admin, setAdmin] = useState(null); // To store admin user data

  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.status === 200 && response.data.userId === "admin") {
        // Successful login
        setAdmin(response.data);
        setIsLoggedIn(true);
        localStorage.setItem("admin", JSON.stringify(response.data)); // Store admin data in localStorage
        toast.success("Logged In successfully", {
          position: "top-center",
          autoClose: 2000, 
        });
      } else {
        toast.error("Invalid credentials, please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
        setError("Invalid credentials.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "An error occurred.");
        toast.error(error.response.data.error, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdmin(null);
    localStorage.removeItem("admin"); // Remove admin data from localStorage
    toast.success("Logged out successfully", {
      position: "top-center",
      autoClose: 1000, 
    });
  };

  // Fetch data after successful login (when admin is logged in)
  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get("http://localhost:8080/api/admin/users")
        .then((response) => setUsers(response.data))
        .catch((error) => console.error(error));

      axios
        .get("http://localhost:8080/api/admin/auctions")
        .then((response) => setAuctions(response.data))
        .catch((error) => console.error(error));

      axios
        .get("http://localhost:8080/api/admin/bids")
        .then((response) => setBids(response.data))
        .catch((error) => console.error(error));
    }
  }, [isLoggedIn]); // Run the effect when login state changes

  // Handle delete actions
  const handleDeleteUser = (userId) => {
    axios
      .delete(`http://localhost:8080/api/admin/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId)); // Update state after deletion
      })
      .catch((error) => console.error(error));
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 1000);
      toast.success("Deleted successfully", {
        position: "top-center",
        autoClose: 1000, 
      });
  };

  const handleDeleteAuction = (auctionId) => {
    console.log(`http://localhost:8080/api/admin/auctions/${auctionId}`)
    axios
      .delete(`http://localhost:8080/api/admin/auctions/${auctionId}`)
      .then(() => {
        setAuctions(auctions.filter((auction) => auction.id !== auctionId)); // Update state after deletion
      })
      .catch((error) => console.error(error));
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 1000);
      toast.success("Deleted successfully", {
        position: "top-center",
        autoClose: 1000, 
      });
  };

  const handleDeleteBid = (bidId) => {
    console.log(`http://localhost:8080/api/admin/bids/${bidId}`)
    axios
      .delete(`http://localhost:8080/api/admin/bids/${bidId}`)
      .then(() => {
        setBids(bids.filter((bid) => bid.id !== bidId)); // Update state after deletion
      })
      .catch((error) => console.error(error));
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 200);
  };
  const handleEditAuction = (auctionId) => {
    navigate(`/aeditauction/${auctionId}`);
  };
  const handleEditUserClick = (user) => {
    navigate(`/aeditprofile`, { state: { user } });
  };
  // Check if the user was logged in previously
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
      setIsLoggedIn(true); // Set login state if admin data exists in localStorage
    }
  }, []); // Run only once when the component mounts

  if (!isLoggedIn) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </Box>
          <Box mb={2}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </Box>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={3} mb={5} display="flex" justifyContent="space-between">
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Users Section */}
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pb: 2, mb: 5 }}>
        {users.map((user) => (
          user.userId!=='admin' && <Card key={user.id} sx={{ minWidth: "250px" }}>
            <CardContent>
              <Typography
                variant="h6"
                color={user.email ? "inherit" : "textSecondary"}
              >
                {user.username}
              </Typography>
              <Typography
                variant="body2"
                color={user.email ? "textSecondary" : "error"}
              >
                {user.email || "Deleted User"}
              </Typography>
            </CardContent>

            {user.email && (
              <CardActions>
                <Button size="small" variant="outlined" color="primary"  onClick={() => handleEditUserClick(user)}>
                  Update
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </CardActions>
            )}
          </Card>
        ))}
      </Box>

      {/* Auctions Section */}
      <Typography variant="h5" gutterBottom>
        Auctions
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pb: 2, mb: 5 }}>
        {auctions.map((auction) => (
          <Card key={auction.id} sx={{ minWidth: "250px" }}>
            <CardContent>
            <Typography variant="h6">{auction.title}</Typography>
            <Typography variant="body1" color="textSecondary">{auction.description}</Typography>
              <Typography variant="body2" color="textSecondary">
                Ends: {new Date(auction.endTime).toLocaleString()}
              </Typography>
              <Typography variant="body2" >
                Current Price: ${auction.currentPrice}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined" color="primary" onClick={() => handleEditAuction(auction.auctionId)}>
                Update
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleDeleteAuction(auction.auctionId)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Bids Section */}
      <Typography variant="h5" gutterBottom>
        Bids
      </Typography>
      <Box sx={{ display: "flex", overflowX: "auto", gap: 2, pb: 2, mb: 5 }}>
        {bids.map((bid) => {
          const auction = auctions.find(
            (auction) => Number(auction.auctionId) === Number(bid.auctionId)
          );
          const user = users.find(
            (user) => Number(user.id) === Number(bid.userId)
          );
          return (
            <Card key={bid.id} sx={{ minWidth: "250px" }}>
              <CardContent>
                <Typography variant="h6">
                  Bid Amount: ${bid.bidAmount}
                </Typography>
                <Typography variant="body2">Auction ID: {bid.auctionId}</Typography>
              <Typography variant="body2">User ID: {bid.userId}</Typography>
                <Typography variant="body2">
                  Auction Title: {auction ? auction.title : "Auction not found"}
                </Typography>
                <Typography variant="body2">User Name: {user ? user.username : "User not found"}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteBid(bid.bidId)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default Admin;
