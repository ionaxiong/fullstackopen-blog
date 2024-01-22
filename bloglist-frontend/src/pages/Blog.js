import React from "react";
import { Table, Form, Button } from "react-bootstrap";

const Blog = ({ key, blog, handleLike }) => {
  return (
    <div key={key}>
      <p>hello world</p>
      <h2>{blog.content}</h2>
      <div>{blog.author}</div>
      <div>
        <div>{blog.likes} likes</div>
        <div>
          <Button>like</Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
