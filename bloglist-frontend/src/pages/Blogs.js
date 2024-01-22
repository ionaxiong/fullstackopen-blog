import React from "react";
// import Blog from "../components/Blog";
import Blog from "./Blog";
import blogService from "../services/blogs";
import { useDispatch } from "react-redux";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const Blogs = (props) => {
  const dispatch = useDispatch();
  const blogs = props.blogs;
  console.log("blogs", blogs);

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
      props.setBlogs(updatedBlogs); // set blog state
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
        props.setBlogs(updatedBlogs);
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

  return (
    <>
      {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            // handleDeleteBlog={handleDeleteBlog}
          />
        ))}
    </>
  );
};

export default Blogs;
