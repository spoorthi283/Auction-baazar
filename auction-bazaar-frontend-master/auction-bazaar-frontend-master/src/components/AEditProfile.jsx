import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AEditProfile() {
  const location = useLocation();
  const user = location.state?.user; 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate the form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/users/${user.id}`, formData);
      if (response.status === 200) {
        toast.success("Profile updated successfully", {
          position: "top-center",
          autoClose: 2000, // Automatically close after 2 seconds
        });
        console.log(response.data);
        navigate("/admin"); // Redirect back to the profile page
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginLeft: "1rem" }}
          onClick={() => navigate("/profile")}
        >
          Cancel
        </Button>
      </form>
    </Box>
  );
}
