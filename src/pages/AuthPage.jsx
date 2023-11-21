import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageClassName, setMessageClassName] = useState(null);

  const navigate = useNavigate();

  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(response.user);
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setMessage("Password should be at least 6 characters");
      } else if (error.code === "auth/email-already-in-use") {
        setMessage("Username already exists.");
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
      const response = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(response.user);
    } catch (error) {
      setMessage("Wrong username or password. Please try again.");
      setMessageClassName("text-danger");
      console.error(error);
    }
  };

  const handleClose = () => {
    setModalShow(null);
    setMessage("");
    setMessagePhone("");
    setUsername("");
    setPassword("");
    setPhoneNumber("");
  };

  const handleSignInGoogle = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignInFacebook = async (e) => {
    e.preventDefault();
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showVerification, setShowVerification] = useState(false);

  const [messagePhone, setMessagePhone] = useState("");
  const [messagePhoneClassName, setMessagePhoneClassName] = useState(null);

  const handleSignInPhone = async (e) => {
    e.preventDefault();
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {}
    );
    const appVerifier = window.recaptchaVerifier;
    try {
      if ((auth, phoneNumber, appVerifier)) {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );
        window.confirmationResult = confirmationResult;
      }
      setShowVerification(true);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-phone-number") {
        setMessagePhone("Invalid phone number.");
      } else if (error.code === "auth/too-many-requests") {
        setMessagePhone("Too many requests, Try again later");
      } else {
        setMessagePhone("Try again later.");
      }
      setMessagePhoneClassName("text-danger");
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    try {
      const result = await window.confirmationResult.confirm(verificationCode);
      console.log(result.user);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/invalid-verification-code") {
        setMessagePhone("Wrong verification code.");
        setMessagePhoneClassName("text-danger");
      }
    }
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
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={handleSignInGoogle}
          >
            <i className="bi bi-google"></i> Sign up with Google
          </Button>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={handleSignInFacebook}
          >
            <i className="bi bi-facebook"></i> Sign up with Facebook
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
          {showVerification ? (
            <div className="p-3">
              <Form.Group
                className="mb-3"
                controlId="formBasicVerificationCode"
              >
                <Form.Control
                  onChange={(e) => setVerificationCode(e.target.value)}
                  value={verificationCode}
                  type="number"
                  placeholder="Enter verification code"
                />
              </Form.Group>
              <p className={messagePhoneClassName}>{messagePhone}</p>
              <div className="text-center">
                <Button
                  className="rounded-pill px-5"
                  variant="outline-primary"
                  onClick={handleConfirmCode}
                >
                  Confirm Code
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                {modalShow === "SignUp"
                  ? "Create your account"
                  : "Log in to your account"}
              </h2>
              <Form
                className="d-grid gap-2 px-5 mb-3"
                onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
              >
                <Form.Group className="mb-1" controlId="formBasicEmail">
                  <Form.Control
                    onChange={(e) => setUsername(e.target.value)}
                    type="email"
                    placeholder="Enter username"
                  />
                  <p className={messageClassName}>{message}</p>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Group>
                <p className="my-2" style={{ fontSize: "12px" }}>
                  {modalShow === "SignUp"
                    ? "By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. SigmaTweets may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account seceure and personalising our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here."
                    : ""}
                </p>

                <Button className="rounded-pill" type="submit">
                  {modalShow === "SignUp" ? "Sign up" : "Log in"}
                </Button>
              </Form>
              <div className="text-center">
                {modalShow === "SignUp" ? (
                  ""
                ) : (
                  <>
                    <p>or</p>
                    <Button
                      className="rounded-pill me-3"
                      variant="outline-dark"
                      onClick={handleSignInGoogle}
                    >
                      <i className="bi bi-google"></i> Sign in with Google
                    </Button>
                    <Button
                      className="rounded-pill"
                      variant="outline-dark"
                      onClick={handleSignInFacebook}
                    >
                      <i className="bi bi-facebook"></i> Sign in with Facebook
                    </Button>
                    <p className="my-3">or</p>
                    <Form.Group className="mb-1" controlId="formBasicPhone">
                      <Form.Control
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                        type="tel"
                        placeholder="Enter phone number with country code. E.g. +123456789"
                      />
                      <p className={messagePhoneClassName}>{messagePhone}</p>
                    </Form.Group>
                    <Button
                      className="rounded-pill"
                      variant="outline-dark"
                      onClick={handleSignInPhone}
                    >
                      <i className="bi bi-phone"></i> Sign in with Phone
                    </Button>
                    <div className="mt-3" id="recaptcha-container"></div>
                  </>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Row>
  );
}
