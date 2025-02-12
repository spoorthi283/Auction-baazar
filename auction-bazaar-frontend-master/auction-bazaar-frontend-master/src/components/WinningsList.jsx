import React, { useState, useEffect } from "react";
import axios from "axios"; // For making HTTP requests
import { Card, CardContent, CardHeader, Typography } from "@mui/material"; // Material UI components
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap

export default function WinningsList() {
  const [winnings, setWinnings] = useState([]); // State to store winning auctions
  const loggedInUserId = 1; // Replace this with the actual logged-in user's ID

  useEffect(() => {
    // Fetch auctions from the backend
    axios
      .get("http://localhost:8080/api/admin/auctions") // Replace with correct endpoint
      .then((response) => {
        const userWinnings = response.data.filter(
          (auction) => auction.winnerUserId === loggedInUserId
        );
        setWinnings(userWinnings);
      })
      .catch((error) => {
        console.error("Error fetching auctions:", error);
      });
  }, [loggedInUserId]);

  return (
    <Card className="mb-4">
      <CardHeader
        title={<Typography variant="h6">Recent Winnings</Typography>}
      />
      <CardContent>
        <div
          style={{ height: "195px", overflowY: "auto", paddingRight: "1rem" }}
        >
          <table className="table table-striped table-bordered w-100">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {winnings.length > 0 ? (
                winnings.map((winning) => (
                  <tr key={winning.id}>
                    <td>{winning.title}</td>
                    <td>{`$${winning.currentPrice}`}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No winnings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
