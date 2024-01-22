import React from "react";
import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

const LoginForm = (props) => {
  // LoginForm.propTypes = {
  //   handleLogin: PropTypes.func.isRequired,
  //   username: PropTypes.string.isRequired,
  //   handleUsernameChange: PropTypes.func.isRequired,
  //   password: PropTypes.string.isRequired,
  //   handlePasswordChange: PropTypes.func.isRequired,
  // };

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={props.handleLogin}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={props.username}
            name="Username"
            placeholder="username"
            onChange={props.handleUsernameChange}
          ></Form.Control>
          <Form.Label>password</Form.Label>

          <Form.Control
            id="password"
            type="password"
            value={props.password}
            name="Password"
            placeholder="password"
            onChange={props.handlePasswordChange}
          ></Form.Control>

          <Button id="login-button" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
