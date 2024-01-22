import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import { func } from "prop-types";

// 5.13 testing content rendering
// checks that the component displaying a blog renders the blog's title and author,
// but does not render its URL or number of likes by default.
test("display blog title and author, but not url or likes", () => {
  let container;
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
  };

  container = render(<Blog blog={blog} />).container;

  expect(screen.getByText("test title")).toBeDefined();
  expect(screen.getByText("test author")).toBeDefined();

  const titleAuthorDiv = container.querySelector(".titleAuthor");
  expect(titleAuthorDiv).not.toHaveStyle("display: none");

  const expandedViewDiv = container.querySelector(".expandedView");
  expect(expandedViewDiv).toHaveStyle("display: none");
  // const urlDiv = container.querySelector(".url");
  // expect(urlDiv).toHaveStyle("display: none;");

  // const likesDiv = container.querySelector(".likes");
  // expect(likesDiv).toHaveStyle("display: none;");
});

// 5.14  checks that the blog's URL and number of likes are shown
// when the button controlling the shown details has been clicked
test("display blog url and likes when button clicked", async () => {
  let container;
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
  };

  container = render(<Blog blog={blog} />).container;

  const button = screen.getByText("view");
  await userEvent.click(button);
  const expandedViewDiv = container.querySelector(".expandedView");
  expect(expandedViewDiv).not.toHaveStyle("display: none");
});

// 5.15 checks that if the like button is clicked twice,
// the event handler the component received as props is called twice.
test("clicking like button twice calls event handler twice", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: 0,
  };

  const mockHandler = jest.fn();

  render(<Blog blog={blog} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
});

// 5.16 create a new blog and test that the form calls
// the event handler it received as props with the right details
test("create a new blog and test that the form calls the event handler it received as props with the right details", async () => {
  const createBlog = jest.fn();

  // const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const title = screen.getByPlaceholderText("title");
  const author = screen.getByPlaceholderText("author");
  const url = screen.getByPlaceholderText("url");

  await userEvent.type(title, "test title");
  await userEvent.type(author, "test author");
  await userEvent.type(url, "test url");

  const createButton = screen.getByText("create");

  await userEvent.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    author: "test author",
    title: "test title",
    url: "test url",
    likes: 0,
  });
});

// testing content rendering
test("renders content", () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
  };

  render(<Blog blog={blog} />);
  expect(screen.getByText("test title")).toBeDefined();
});

// testing button click
test("clicking the button calls event handler once", async () => {
  const blog = {
    title: "test title",
    author: "test author",
    url: "test url",
    likes: 0,
  };

  const mockHandler = jest.fn();

  const user = userEvent.setup();

  render(<Blog blog={blog} handleLike={mockHandler} />);

  const button = screen.getByText("like");

  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});

// testing togglable component
describe("<Togglable />", () => {
  let container;

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">togglable content</div>
      </Togglable>
    ).container;
  });

  test("renders its children", async () => {
    await screen.findByText("togglable content");
  });

  test("at start the children are not displayed", () => {
    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display: none");
  });

  test("after clicking the button, children are displayed", async () => {
    const user = userEvent.setup();

    const button = screen.getByText("show...");
    await user.click(button);

    const div = container.querySelector(".togglableContent");
    expect(div).not.toHaveStyle("display: none");
  });

  test("toggled content can be closed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button);

    const closeButton = screen.getByText("cancel");
    await user.click(closeButton);

    const div = container.querySelector(".togglableContent");
    expect(div).toHaveStyle("display: none");
  });
});
