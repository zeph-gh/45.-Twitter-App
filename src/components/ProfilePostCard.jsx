import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import CommentPostModal from "./CommentPostModal";
import { useDispatch } from "react-redux";
import {
  deletePost,
  fetchCommentsByPostId,
} from "../features/posts/postsSlice";

export default function ProfilePostCard({
  username,
  content,
  postId,
  created_at,
  comments,
}) {
  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
  const BASE_URL =
    "https://twitter-api-zeph-goh.sigma-school-full-stack.repl.co";

  const [likes, setLikes] = useState([]);
  const [views, setViews] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => setShowDelete(false);

  const [showComment, setShowComment] = useState(false);

  const [showCommentById, setShowCommentById] = useState(null);

  const handleClose = () => {
    setShowCommentById(null);
    setShowComment(false);
  };
  const handleComment = (postId) => {
    setShowCommentById(postId);
    setShowComment(true);
  };

  // Decoding to get the userId
  const token = localStorage.getItem("authToken");
  const decode = jwtDecode(token);
  const userId = decode.id;

  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    //get like
    fetch(`${BASE_URL}/likes/post/${postId}`)
      .then((response) => response.json())
      .then((data) => setLikes(data))
      .catch((error) => console.error("Error:", error));

    //get view
    fetch(`${BASE_URL}/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => setViews(data.views))
      .catch((error) => console.error("Error:", error));
  }, [postId]);

  useEffect(() => {
    // get username by userId
    dispatch(fetchCommentsByPostId(postId));
  }, [dispatch, postId]);

  const isLiked = likes.some((like) => like.user_id === userId);

  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {
    axios
      .post(`${BASE_URL}/likes`, {
        user_id: userId,
        post_id: postId,
      })
      .then((response) => {
        setLikes([...likes, { ...response.data, likes_id: response.data.id }]);
      })
      .catch((error) => console.error("Error:", error));
  };

  const removeFromLikes = () => {
    const like = likes.find((like) => like.user_id === userId);
    if (like) {
      axios
        .put(`${BASE_URL}/likes/${userId}/${postId}`)
        .then(() => {
          setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleDeletePost = () => {
    dispatch(deletePost(postId));
  };

  return (
    <>
      <Row
        className="p-3"
        style={{
          borderTop: "1px solid #D3D3D3",
          borderBottom: "1px solid #D3D3D3",
        }}
      >
        <Col sm={1}>
          <Image src={pic} fluid roundedCircle />
        </Col>

        <Col sm={10}>
          <strong className="pe-1">{username}</strong>
          <span>
            @{username} · {formattedDate}
          </span>
          <p>{content}</p>
          <div className="d-flex justify-content-between">
            <Button variant="light" onClick={() => handleComment(postId)}>
              <i className="bi bi-chat"></i>
              {comments.length}
            </Button>
            <Button variant="light">
              <i className="bi bi-repeat"></i>
            </Button>
            <Button variant="light" onClick={handleLike}>
              {isLiked ? (
                <i className="bi bi-heart-fill text-danger"></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}
              {likes.length}
            </Button>
            <Button variant="light">
              <i className="bi bi-bar-chart"></i>
              {views}
            </Button>
            <Button variant="light">
              <i className="bi bi-upload"></i>
            </Button>
          </div>
          <CommentPostModal
            show={showComment && showCommentById === postId}
            handleClose={handleClose}
            postId={postId}
            content={content}
            username={username}
            created_at={created_at}
            comments={comments}
          />
        </Col>
        <Col sm={1}>
          <Button
            variant="light"
            className="bi bi-trash text-danger border-0"
            onClick={handleShowDelete}
          />
        </Col>
      </Row>

      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
