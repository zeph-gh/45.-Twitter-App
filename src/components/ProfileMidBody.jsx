import { Button, Col, Image, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";

export default function ProfileMidBody() {
  const url =
    "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  //the fetch from redux
  const dispatch = useDispatch(); //sender
  //receiver
  const posts = useSelector((state) => state.posts.posts); //state.posts.posts = PostSlice.name.initialState
  const loading = useSelector((state) => state.posts.loading); // loading UX
  const username = useSelector((state) => state.posts.username);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // to avoid crash if uid === null
    if (currentUser) {
      dispatch(fetchPostsByUser(currentUser.uid));
    }
  }, [dispatch, currentUser]);

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid />
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8F9FA",
          marginLeft: 15,
        }}
      />

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className="rounded-pill mt-2" variant="outline-secondary">
            Edit Profile
          </Button>
        </Col>
      </Row>

      <p
        className="mt-5"
        style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}
      >
        {username}
      </p>

      <p style={{ marginBottom: "2px" }}>@{username}</p>

      <p>Aspiring Full Stack Web Developer</p>

      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && (
        <Spinner animation="border" className="ms-3 mt-3" variant="primary" /> // spinner effect when redux loading true
      )}
      {posts.length > 0 &&
        posts.map((post) => <ProfilePostCard key={post.id} post={post} />)}
    </Col>
  );
}
