import React, { useContext } from "react";
import { format } from "date-fns";
import { Button, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext"; // Correct AuthContext import
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuctionProfile from "../components/AuctionProfile";
import axios from "axios"; // For making HTTP requests
import { useNavigate } from "react-router-dom"; // For navigation after deletion
import { toast } from "react-toastify";

export default function Profile() {
  const { user, loggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!loggedIn || !user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Typography variant="h5" color="error">
          Please log in to view your profile.
        </Typography>
      </div>
    );
  }

  // Safely format dates
  const formattedCreatedAt = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM d, yyyy")
    : "N/A";

  const formattedLastLogin = user?.lastLogin
    ? format(new Date(user.lastLogin), "MMMM d, yyyy HH:mm")
    : "N/A";

  const handleDeleteAccount = async () => {
    try {
      // Replace with your backend delete user endpoint
      const response = await axios.delete(`http://localhost:8080/api/admin/users/${user.id}`);
      if (response.status === 200) {
        toast.success("Account deleted successfully", {
          position: "top-center",
          autoClose: 2000, // Automatically close after 2 seconds
        });
        logout(); // Clear user data and log out
        navigate("/"); // Redirect to home page or login page
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete your account. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader
            title="User Profile"
            titleTypographyProps={{ variant: "h6", align: "center" }}
          />
          <CardContent>
            <Grid container spacing={3}>
              {/* Left section: User Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Username:</strong> {user.username}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Member since:</strong> {formattedCreatedAt}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Last login:</strong> {formattedLastLogin}
                </Typography>
              </Grid>

              {/* Right section: Auction Details */}
              <Grid item xs={12} md={6}>
                <AuctionProfile />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outlined" fullWidth style={{ marginRight: "8px" }} onClick={() => navigate("/editprofile")}>
            Edit Profile
          </Button>
          <Button variant="outlined" fullWidth style={{ marginRight: "8px" }} onClick={() => navigate("/resetpassword")}>
            Reset Password
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
