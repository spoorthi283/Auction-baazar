import React, { useState, useEffect, useContext } from 'react';
import { CardHeader, CardContent } from '@mui/material';
import AuctionCard from './AuctionCard';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Context to get the logged-in user's info

export default function YourAuctions() {
  const { user } = useContext(AuthContext); // Assuming AuthContext provides logged-in user details
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYourAuctions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/auctions'); // Update endpoint as needed
        const allAuctions = response.data;

        // Filter auctions where owner_id matches the logged-in user's ID
        console.log(allAuctions)
        const userAuctions = allAuctions.filter((auction) => auction.ownerId === user.id);
        console.log(userAuctions)
        // Add status based on date comparison
        const now = new Date();
        const auctionsWithStatus = userAuctions.map((auction) => {
          const startTime = new Date(auction.startTime);
          const endTime = new Date(auction.endTime);

          let status;
          if (now < startTime) {
            status = 'upcoming';
          } else if (now >= startTime && now <= endTime) {
            status = 'running';
          } else {
            status = 'closed';
          }

          return { ...auction, status };
        });

        setAuctions(auctionsWithStatus);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYourAuctions();
  }, [user]);

  return (
    <div className="my-4">
      <CardHeader title="Your Auctions" />
      <CardContent>
        {loading ? (
          <p>Loading your auctions...</p>
        ) : auctions.length === 0 ? (
          <p>No auctions found</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="col">
                <AuctionCard auction={auction} setAuctions={setAuctions} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
}
