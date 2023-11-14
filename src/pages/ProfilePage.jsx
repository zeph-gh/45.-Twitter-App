import { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileSideBar from "../components/ProfileSidebar";
import ProfileMidBody from "../components/ProfileMidBody";
import ProfileRightSideBar from "../components/ProfileRightSidebar";

export default function ProfilePage() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();

  // check for authToken ommedialy upon component mount and whenever authToken changes
  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // redirect to login if no token
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    setAuthToken(""); // clear token from localStorage
  };

  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <ProfileMidBody />
          <ProfileRightSideBar />
        </Row>
      </Container>
    </>
  );
}
