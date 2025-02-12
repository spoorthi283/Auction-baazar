import React from 'react'
import AuctionProfile from '../components/AuctionProfile'
import WinningsList from '../components/WinningsList'
import YourAuctions from '../components/YourAuctions'
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <>
      <Header/>
      <div className="container my-4">
      <h1 className="display-4 mb-5">Auction Dashboard</h1>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        <div className="col">
          <AuctionProfile />
        </div>
        <div className="col">
          <WinningsList />
        </div>
      </div>

      <div className="mt-4">
        <YourAuctions/>
      </div>
    </div>
      <Footer/>
    </>
  )
}

export default Dashboard

