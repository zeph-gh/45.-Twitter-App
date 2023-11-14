import { useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  fetchCommentsByPostId,
  saveComment,
} from "../features/posts/postsSlice";
import CommentCard from "./CommentCard";

export default function CommentPostModal({
  show,
  handleClose,
  postId,
  content,
  username,
  created_at,
  comments,
}) {
  const [postComment, setPostComment] = useState("");

  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(saveComment({ postId, postComment })).then(() => {
      setPostComment("");
      dispatch(fetchCommentsByPostId(postId));
    });
  };

  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const formattedDate = new Date(created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="bg-light">
          <Row className="p-3">
            <Col sm={1}>
              <Image src={pic} fluid roundedCircle />
            </Col>

            <Col sm={8}>
              <strong className="pe-1">{username}</strong>
              <span>
                @{username} · {formattedDate}
              </span>
              <p>{content}</p>
            </Col>
          </Row>

          <Form className="mb-4">
            <Form.Group controlId="postComment">
              <Form.Control
                placeholder="Post your reply"
                as="textarea"
                rows={3}
                value={postComment}
                onChange={(e) => setPostComment(e.target.value)}
              />
            </Form.Group>
          </Form>

          {comments &&
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} postId={postId} />
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="rounded-pill"
            onClick={handleSave}
          >
            Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
