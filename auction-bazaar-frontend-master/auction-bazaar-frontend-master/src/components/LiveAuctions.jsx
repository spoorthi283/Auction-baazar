import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, Button, TextField, CardActions } from '@mui/material';
import { AuthContext } from "../context/AuthContext"; // Auth context for user state
import axios from 'axios'; // For making API requests
import { toast } from "react-toastify"; 

export default function LiveAuctions() {
  const { loggedIn, user } = useContext(AuthContext); // Access logged-in state and user ID from AuthContext
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // For displaying error messages

  // Ensure user is defined before using user.id
  const userId = user ? user.id : null; 

  // Fetch auctions dynamically from the API
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/auctions'); // Update with your backend endpoint
        const allAuctions = response.data;

        // Filter and sort live auctions
        const currentDateTime = new Date();
        const liveAuctions = allAuctions
          .filter(
            (auction) =>
              new Date(auction.startTime) <= currentDateTime &&
              currentDateTime <= new Date(auction.endTime)
          )
          .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));

        setAuctions(liveAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setError("Failed to load auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Handle placing a bid
  const handlePlaceBid = async (auctionId, bidAmount, ownerId) => {
    if (ownerId === userId) {
      // Prevent bidding on your own auction
      alert("You cannot place a bid on your own auction.");
      return;
    }

    try {
      // Send the bid request to the backend
      const response = await axios.post('http://localhost:8080/api/bids/placeBid', {
        auctionId,
        userId, // Get user ID from the context
        bidAmount,
      });
      console.log(response.data);
      toast.success("Bid placed successfully!", {
        position: "top-center",
        autoClose: 2000, // Automatically close after 2 seconds
      });
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 2000);
    } catch (error) {
      console.error("Error placing bid:", error.response ? error.response.data : error.message);
      toast.error("Failed to place bid.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Live Auctions</h2>

      {/* Show loading spinner or message */}
      {loading && <p>Loading auctions...</p>}

      {/* Show "Nothing to show" if the list is empty */}
      {!loading && auctions.length === 0 && (
        <p style={{ textAlign: "center", fontWeight: "bold", margin: "20px 0" }}>
          Nothing to show
        </p>
      )}

      {/* Scrollable container */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '10px 0',
        }}
      >
        {auctions.map((auction) => (
          <div key={auction.id} style={{ marginRight: '16px' }}>
            <Card style={{ minWidth: "400px" }}>
              <CardHeader
                title={auction.title}
                subheader={auction.description}
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              />
              <CardContent>
                <p>Start: {new Date(auction.startTime).toLocaleString()}</p>
                <p>End: {new Date(auction.endTime).toLocaleString()}</p>
                {/* Show currentBid or startPrice */}
                <p className="font-weight-bold mt-2">
                {auction.currentPrice > 0
                    ? "Current Bid"
                    : "Start Price"}: $
                  {auction.currentPrice > 0
                    ? auction.currentPrice.toLocaleString()
                    : auction.startPrice.toLocaleString()}
                </p>
              </CardContent>

              {loggedIn && userId && auction.ownerId !== userId && (
                <CardActions>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const bidAmount = parseFloat(e.target.bidAmount.value);
                      if (bidAmount > (auction.currentBid || auction.startPrice)) {
                        handlePlaceBid(auction.auctionId, bidAmount, auction.ownerId);
                      } else {
                        alert("Bid must be higher than the current price!");
                      }
                    }}
                    className="d-flex space-x-2"
                  >
                    <TextField
                      type="number"
                      name="bidAmount"
                      label="Enter bid amount"
                      placeholder="Enter bid amount"
                      min={(auction.currentBid || auction.startPrice) + 1}
                      step="0.01"
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ marginLeft: '8px' }}
                    >
                      Place Bid
                    </Button>
                  </form>
                </CardActions>
              )}

              {auction.ownerId === userId && (
                <p style={{ textAlign: 'center', color: 'red' }}>
                  You cannot place a bid on your own auction.
                </p>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
