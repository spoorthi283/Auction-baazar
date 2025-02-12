import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';

const UpcomingAuctions = () => {
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/auctions'); // Adjust the endpoint
        const allAuctions = response.data;

        console.log("Fetched auctions:", allAuctions); // Debugging

        // Current date and time
        const currentDateTime = new Date();

        // Filter upcoming auctions
        const upcoming = allAuctions.filter(
          (auction) => new Date(auction.startTime) > currentDateTime
        );

        console.log("Filtered upcoming auctions:", upcoming); // Debugging

        setUpcomingAuctions(upcoming);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <>
      <section className="my-4">
        <h2 className="h2 mb-4">Upcoming Auctions</h2>

        {/* Show loading spinner or message */}
        {loading && <p>Loading upcoming auctions...</p>}

        {/* Show "Nothing to show" if no upcoming auctions are available */}
        {!loading && upcomingAuctions.length === 0 && (
          <p style={{ textAlign: "center", fontWeight: "bold", margin: "20px 0" }}>
            No upcoming auctions available
          </p>
        )}

        {/* Horizontal Scroll Box using Material UI */}
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            paddingBottom: 2,
          }}
        >
          {upcomingAuctions.map((auction) => (
            <div
              className="card"
              key={auction.id}
              style={{ minWidth: '300px', flexShrink: 0 }}
            >
              <div className="card-header">
                <h5 className="card-title">{auction.title}</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Starting Bid: ${auction.startPrice}</p>
                <p className="card-text">
                  Starts: {new Date(auction.startTime).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </Box>
      </section>
    </>
  );
};

export default UpcomingAuctions;
