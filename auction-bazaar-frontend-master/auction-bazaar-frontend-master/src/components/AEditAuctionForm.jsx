import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function AEditAuctionForm() {
  const { id } = useParams(); // Get auction ID from URL
  const navigate = useNavigate();

  const [auction, setAuction] = useState({
    title: "",
    description: "",
    startPrice: 0,
    endTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch auction details when the component mounts
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/auctions/${id}`);
        setAuction(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching auction:", err);
        setError("Failed to load auction details.");
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(auction);
      await axios.put(`http://localhost:8080/api/auctions/update/${id}`, auction);
      toast.success("Auction updated successfully", {
        position: "top-center",
        autoClose: 2000, // Automatically close after 2 seconds
      });
      navigate("/admin"); // Redirect back to the auction list
    } catch (err) {
      console.error("Error updating auction:", err);
      toast.error("Failed to update auction", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Auction
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={auction.title}
          onChange={handleInputChange}
        />
        
        {/* Description Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={auction.description}
          onChange={handleInputChange}
        />

        {/* Start Price Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Start Price"
          name="startPrice"
          type="number"
          value={auction.startPrice}
          onChange={handleInputChange}
        />

        {/* End Time Field */}
        <TextField
          fullWidth
          margin="normal"
          label="End Time"
          name="endTime"
          type="datetime-local"
          value={auction.endTime}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true, // Ensure label stays above input
          }}
        />

        {/* Submit and Cancel Buttons */}
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Update Auction
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: "1rem" }}
            onClick={() => navigate("/admin")}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}
