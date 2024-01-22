import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { useDispatch } from "react-redux";
import { setNotificationWithTimeout } from "./reducers/notificationReducer";
import { Table, Form, Button } from "react-bootstrap";
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
import Home from "./pages/Home";
import Users from "./pages/Users";
import Blogs from "./pages/Blogs";
import BlogPage from "./pages/Blog"

const App = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const noteFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log("exception", exception);
      dispatch(
        setNotificationWithTimeout("Wrong username or password", 5, "error")
      );
    }
  };

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel="login">
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            password={password}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
        </Togglable>
      </div>
    );
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const createBlog = async (blog) => {
    try {
      noteFormRef.current.toggleVisibility();
      const newBlog = await blogService.create(blog);
      setBlogs([...blogs, newBlog]);
      dispatch(
        setNotificationWithTimeout(
          `a new blog ${blog.title}! by ${blog.author} added `,
          5,
          "success"
        )
      );
    } catch (exception) {
      console.log("exception", exception);
      dispatch(
        setNotificationWithTimeout(exception.response.data.error, 5, "error")
      );
    }
  };

  const handleLike = async (blog) => {
    try {
      const newBlog = {
        ...blog,
        likes: blog.likes + 1,
      };
      const id = blog.id;
      const updatedBlog = await blogService.update(id, newBlog); // update single blog
      const blogIndex = blogs.findIndex((b) => b.id === id); // find blog in array to update
      const updatedBlogs = [...blogs]; // copy blogs to make react rerender
      updatedBlogs[blogIndex] = updatedBlog; // update blog at index
      setBlogs(updatedBlogs); // set blog state
      dispatch(
        setNotificationWithTimeout(`you liked ${blog.title}!`, 5, "success")
      );
    } catch (exception) {
      console.log("exception", exception);
      dispatch(
        setNotificationWithTimeout(exception.response.data.error, 5, "error")
      );
    }
  };

  const handleDeleteBlog = async (blog) => {
    try {
      const id = blog.id;
      if (window.confirm(`Remove blog ${blog.title}! by ${blog.author}`)) {
        await blogService.remove(id);
        const updatedBlogs = blogs.filter((b) => b.id !== id);
        setBlogs(updatedBlogs);
        dispatch(
          setNotificationWithTimeout(
            `Remove blog ${blog.title} by ${blog.author}!`,
            5,
            "success"
          )
        );
      }
    } catch (exception) {
      console.log("exception", exception);
      dispatch(
        setNotificationWithTimeout(exception.response.data.error, 5, "error")
      );
    }
  };

  const blogFrom = () => (
    <Togglable buttonLabel="new blog" ref={noteFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  );

  const padding = {
    padding: 5,
  };

  return (
    <div className="container">
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
                <em style={padding}>{user.name} logged in</em>
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
        {/* <Route path="/blogs/:id" element={<BlogPage />} /> */}
        <Route path="/blogs" element={<Blogs blogs={blogs} />} />
        {/* <Route path="/users" element={<Users />} /> */}
        {/* <Route path="/login" element={<LoginForm />} /> */}
      </Routes>
      <h1>Blogs</h1>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <div>{user.name} logged-in</div>
          <Button type="submit" onClick={handleLogout}>
            logout
          </Button>
          {blogFrom()}
          <br />
          {/* <Blogs blogs={blogs} setBlogs={setBlogs} /> */}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDeleteBlog={handleDeleteBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
