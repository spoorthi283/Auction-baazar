import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import UpcomingAuctions from "../components/UpcomingAuctions";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PastAuctions from "../components/PastAuctions";
import LiveAuctions from "../components/LiveAuctions";

const Home = () => {
  const [topBids, setTopBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch auctions from the API
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/admin/auctions");
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // Sort auctions by current price and take the top 3
          const topBidsData = data
            .filter((auction) => auction.currentPrice) // Ensure currentPrice exists
            .sort((a, b) => b.currentPrice - a.currentPrice) // Descending order
            .slice(0, 3) // Take top 3
            .map((auction) => ({
              id: auction.id,
              title: auction.title,
              currentBid: auction.currentPrice,
            }));
          setTopBids(topBidsData);
        } else {
          setTopBids([]); // No data available
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setTopBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <>
      <Header />
      <div className="container my-4">
        <section className="row my-4">
          <div className="col-md-6">
            <div className="flex-1">
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to AuctionBazzar
              </Typography>
              <Typography variant="h6" paragraph>
              Discover, Bid, and Win! AuctionBazaar offers a seamless platform for buyers and sellers to connect, ensuring every auction is fair, efficient, and rewarding.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "black", // Change button color to black
                  color: "white", // Text color white
                  "&:hover": {
                    backgroundColor: "#333", // Darker shade on hover
                  },
                }}
              >
                <Link
                  to="/auctions"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Explore Auctions
                </Link>
              </Button>
            </div>
          </div>
          <div className="col-md-6">
            <Card className="flex-1">
              <CardHeader
                title={
                  <Typography variant="h6" component="div">
                    Top Bids
                  </Typography>
                }
              />
              <CardContent>
                {loading ? (
                  <Typography variant="body1" align="center">
                    Loading...
                  </Typography>
                ) : topBids.length > 0 ? (
                  <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                    {topBids.map((bid) => (
                      <li
                        key={bid.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1" style={{ flex: 1 }}>
                          {bid.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold", textAlign: "right" }}
                        >
                          ${bid.currentBid}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body1" align="center">
                    Nothing to show
                  </Typography>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="my-4">
          <LiveAuctions />
        </section>
        <section className="my-4">
          <PastAuctions />
        </section>
        <section className="my-4">
          <UpcomingAuctions />
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
