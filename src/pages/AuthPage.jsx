import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";
  const url = "https://auth-back-end-zeph-goh.sigma-school-full-stack.repl.co";
  // Possible values: null (no modal shows), "Login", "Signup"
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const [message, setMessage] = useState("");
  const [messageClassName, setMessageClassName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/profile");
    }
  }, [authToken, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/signup`, { username, password });

      if (res && res.status === 201) {
        setMessage("User resgistered successfully!");
        setMessageClassName("text-success");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Username already exists.");
      } else if (error.response && error.response.status === 500) {
        setMessage("An error occurred. Please try again later.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }

      setMessageClassName("text-danger");

      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/login`, { username, password });
      if (res.data && res.data.auth === true && res.data.token) {
        setAuthToken(res.data.token); //save token to localStorage
        console.log("Login was successful, token saved");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Wrong Username and password.");
      } else if (error.response && error.response.status === 500) {
        setMessage("An error occurred. Please try again later.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }

      setMessageClassName("text-danger");

      console.error(error);
    }
  };

  const handleClose = () => {
    setModalShow(null);
    setMessage(""); // Reset error message when the modal is closed
  };

  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid />
      </Col>
      <Col sm={6} className="p-4">
        <i
          className="bi bi-twitter"
          style={{ fontSize: 50, color: "dodgerblue" }}
        ></i>
        <p className="mt-5" style={{ fontSize: 64 }}>
          Happening Now
        </p>
        <h2 className="mt-5" style={{ fontSize: 31 }}>
          Join Twitter Today.
        </h2>

        <Col sm={5} className="d-grid gap-2">
          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-google"></i> Sign up with Google
          </Button>
          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-apple"></i> Sign up with Apple
          </Button>
          <p style={{ textAlign: "center" }}>or</p>
          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>
          <p style={{ fontSize: "12px" }}>
            By signing up, you agree to the Terms of Service and Privacy Policy
            including Cookie Use.
          </p>
          <p className="mt-5" style={{ fontWeight: "bold" }}>
            Already have an account?
          </p>
          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign In
          </Button>
        </Col>
      </Col>

      <Modal show={modalShow} onHide={handleClose} animation={false} centered>
        <Modal.Body>
          <h2 className="mb-4" style={{ fontWeight: "bold" }}>
            {modalShow === "SignUp"
              ? "Create your account"
              : "Log in to your account"}
          </h2>
          <Form
            className="d-grid gap-2 px-5"
            onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                onChange={(e) => setUsername(e.target.value)}
                type="email"
                placeholder="Enter username"
              />
              <p className={messageClassName}>{message}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <p style={{ fontSize: "12px" }}>
              {modalShow === "SignUp"
                ? "By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. SigmaTweets may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account seceure and personalising our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here."
                : ""}
            </p>

            <Button className="rounded-pill" type="submit">
              {modalShow === "SignUp" ? "Sign up" : "Log in"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Row>
  );
}
