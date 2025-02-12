import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

export default function AuctionProfile() {
  return (
    <Card className="mb-4" style={{ height: "300px" }}>
      <CardHeader title="Auction Profile" />
      <CardContent>
        <div className="row row-cols-1 row-cols-md-2 g-4 p-4">
          <div className="col text-center">
            <Typography variant="h5" component="p" className="font-weight-bold">
              150
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Auctions
            </Typography>
          </div>
          <div className="col text-center">
            <Typography variant="h5" component="p" className="font-weight-bold">
              45
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Winnings
            </Typography>
          </div>
          <div className="col text-center">
            <Typography variant="h5" component="p" className="font-weight-bold">
              120
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Participations
            </Typography>
          </div>
          <div className="col text-center">
            <Typography variant="h5" component="p" className="font-weight-bold">
              30%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Win Rate
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
