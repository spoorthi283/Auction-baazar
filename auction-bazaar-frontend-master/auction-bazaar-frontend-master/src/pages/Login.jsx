import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { 
  Container, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  TextField, 
  Button 
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify"; 

function Login() {
  const { login } = useContext(AuthContext); // Access AuthContext for login function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Show success toast
      if(response.data.userId!=="admin"){toast.success("Logged in successfully!", {
        position: "top-center",
        autoClose: 2000, // Automatically close after 2 seconds
      });}

      // Login successful, pass user object to context and redirect
      login(response.data);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An error occurred during login.";

      // Show error toast
      if (err.response?.status === 401) {
        toast.error("Invalid credentials, please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 3000,
        });
      }
      setError(errorMessage);
    }
  };

  return (
    <>
      <Header />
      <Container
        component="main"
        style={{ minHeight: "70vh", marginBottom: "50px" }}
        maxWidth="xs"
        className="d-flex justify-content-center align-items-center"
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom>
              Login
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Enter your email and password to login
            </Typography>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="mb-3">
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Typography color="error" variant="body2" className="my-2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </form>
          </CardContent>
          <CardActions>
            <Link to="/forgot-password" className="text-decoration-none">
              <Button size="small">Forgot password?</Button>
            </Link>
          </CardActions>
          <CardActions>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none">
                <Button size="small">Sign up</Button>
              </Link>
            </Typography>
          </CardActions>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
