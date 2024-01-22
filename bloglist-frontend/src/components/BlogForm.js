import React, { useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import styles from "../index.css";

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (e) => {
    e.preventDefault();
    createBlog({
      author: author,
      title: title,
      url: url,
      likes: 0,
    });
    setAuthor("");
    setTitle("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            id="title"
            type="text"
            value={title}
            name="Title"
            placeholder="title"
            onChange={({ target }) => setTitle(target.value)}
          ></Form.Control>
          <Form.Label>Author</Form.Label>
          <Form.Control
            id="author"
            type="text"
            value={author}
            name="Author"
            placeholder="author"
            onChange={({ target }) => setAuthor(target.value)}
          ></Form.Control>
          <Form.Label>Url</Form.Label>
          <Form.Control
            id="url"
            type="text"
            value={url}
            name="Url"
            placeholder="url"
            onChange={({ target }) => setUrl(target.value)}
          ></Form.Control>
          <Button id="create-button" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default BlogForm;
