import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import Header from "../components/Header";
import Footer from "../components/Footer";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Use navigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");

    try {
      // Make API call to backend
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          username,
          email,
          password,
        }
      );

      // Show success toast
      toast.success("Signed up successfully! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000, // Automatically close after 2 seconds
      });

      // Clear the form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Handle error response
      if (err.response && err.response.data) {
        setError(err.response.data.message || "An error occurred during registration.");
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="xs"
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Card variant="outlined" className="w-100">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Sign Up
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Create a new account
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-3">
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardActions>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login">
                <Button size="small">Login</Button>
              </Link>
            </Typography>
          </CardActions>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default SignUp;
