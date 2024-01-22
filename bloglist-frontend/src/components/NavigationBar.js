import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch,
} from "react-router-dom";
import LoginForm from "./LoginForm";
import Home from "../pages/Home";
import Users from "../pages/Users";
import Blogs from "../pages/Blogs";
import Blog from "../components/Blog"

const NavigationBar = ({ user, blog }) => {
  const padding = {
    padding: 5,
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                Home
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/blogs">
                Blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                Users
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user ? (
                <em style={padding}>{user} logged in</em>
              ) : (
                <Link style={padding} to="/login">
                  Login
                </Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs/:id" element={<Blog blog={blog} />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
};

export default NavigationBar;
