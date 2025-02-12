import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // For success/error toasts
import { AuthContext } from "../context/AuthContext"; // Import AuthContext to get user info
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

function CreateAuction() {
  const { user } = useContext(AuthContext); // Get the logged-in user's data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState(0); // Dropdown for category
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const categories = [
    { id: 0, name: "Others" },
    { id: 1, name: "Electronics" },
    { id: 2, name: "Furniture" },
    { id: 3, name: "Art" },
    { id: 4, name: "Vehicles" },
  ]; // Add more categories as needed

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before submitting the form
    setLoading(true); // Set loading to true

    // Validate form fields
    if (!title || !description || !startingBid || !startDate || !endDate || categoryId === "") {
      setError("All fields are required.");
      setLoading(false); // Reset loading state
      return;
    }

    // Convert start and end dates to proper format (ISO 8601)
    const startDateTime = new Date(startDate).toISOString();
    const endDateTime = new Date(endDate).toISOString();

    try {
      // Make API call to backend to create auction
      const response = await axios.post("http://localhost:8080/api/auctions/create", {
        title,
        description,
        startPrice: parseFloat(startingBid), // Ensure the price is sent as a number
        startTime: startDateTime,
        endTime: endDateTime,
        ownerId: user.id, // Pass the authenticated user ID as the owner ID
        currentPrice: 0, // Default to starting bid
        categoryId, // Selected category ID
        status: "CREATED", // Default status
      });

      // Show success notification
      toast.success("Auction created successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Reset form fields
      setTitle("");
      setDescription("");
      setStartingBid("");
      setStartDate("");
      setEndDate("");
      setCategoryId(0);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while creating the auction.");
      toast.error("Failed to create auction", { position: "top-center", autoClose: 2000 });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Header />
      <Container component="main" maxWidth="md" style={{ minHeight: "70vh", marginBottom: "50px" }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Create Auction
            </Typography>
            <form onSubmit={handleCreateAuction}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Auction Title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Starting Bid"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    variant="outlined"
                    fullWidth
                    select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    variant="outlined"
                    fullWidth
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    variant="outlined"
                    fullWidth
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? "Creating..." : "Create Auction"} {/* Show text based on loading state */}
                  </Button>
                </Grid>
              </Grid>
            </form>
            {error && <Typography color="error" variant="body2">{error}</Typography>}
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default CreateAuction;
