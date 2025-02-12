import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";

export default function AuctionCard({ auction, setAuctions }) {
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/auctions/${auction.auctionId}`
      );
      toast.success("Auction deleted successfully", {
        position: "top-center",
        autoClose: 2000, // Automatically close after 2 seconds
      });
    } catch (error) {
      console.error("Error deleting auction:", error);
      toast.error("Failed to delete auction", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  const handleDeleteAuction = () => {
    // Implement delete auction logic here
    console.log(`Deleting auction: ${auction.auctionId}`);
    if (
      window.confirm(
        `Are you sure you want to delete the auction "${auction.title}"?`
      )
    ) {
      onDelete();
    }
  };
  const handleEditAuction = () => {
    navigate(`/editauction/${auction.auctionId}`);
  };
  return (
    <Card className="mb-4">
      <CardHeader
        title={
          <div className="d-flex justify-content-between align-items-center">
            <Typography variant="h6">{auction.title}</Typography>
            <span
              className={`badge ${
                auction.status === "running"
                  ? "bg-success" // Green for running
                  : auction.status === "upcoming"
                  ? "bg-primary" // Blue for upcoming
                  : "bg-danger" // Red for closed
              }`}
            >
              {auction.status}
            </span>
          </div>
        }
      />
      <CardContent>
        <Typography variant="body1" className="fw-semibold">
          Current Bid: ${auction.currentPrice || "N/A"}
        </Typography>
      </CardContent>
      <CardActions className="d-flex justify-content-between">
        <Button
          variant="outlined"
          onClick={handleEditAuction}
          disabled={auction.status === "closed"}
        >
          Edit Auction
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteAuction}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
