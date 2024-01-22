import React, { useState } from "react";

const Blog = ({ blog, handleLike, handleDeleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenInvisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="blog">
      <div style={hideWhenVisible} className="titleAuthor">
        {blog.title} {blog.author}
        <button className="viewButton" onClick={toggleVisibility}>
          view
        </button>
      </div>
      <div style={showWhenInvisible} className="expandedView">
        <span className="title">
          {blog.title}{" "}
          <button className="hideButton" onClick={toggleVisibility}>
            hide
          </button>
        </span>
        <br />
        <span className="url"> {blog.url} </span>
        <br />
        <span className="likes">
          likes {blog.likes}
          {blog.likes === 1 ? "The title with the most likes": "The title with the second most likes"}
          <button className="likeButton" onClick={() => handleLike(blog)}>
            like
          </button>
        </span>
        <br />
        <span className="author"> {blog.author} </span>
        <br />
        <button
          className="removeButton"
          style={{ color: "blue" }}
          onClick={() => handleDeleteBlog(blog)}
        >
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
