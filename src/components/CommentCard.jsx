import { Button, Col, Image, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  deleteComment,
  fetchCommentsByPostId,
} from "../features/posts/postsSlice";
import { useState } from "react";

export default function CommentCard({ comment, postId }) {
  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const formattedDate = new Date(comment.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const dispatch = useDispatch();

  const [showDelete, setShowDelete] = useState(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => setShowDelete(false);

  const handleDeleteComment = () => {
    dispatch(deleteComment(comment.id)).then(() => {
      dispatch(fetchCommentsByPostId(postId));
    });
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
        <Col sm={1} className="me-3">
          <Image src={pic} roundedCircle height="30px" />
        </Col>

        <Col sm={8}>
          <strong className="pe-1">{comment.username}</strong>
          <span>
            @{comment.username} · {formattedDate}
          </span>
          <p>{comment.comment_text}</p>
        </Col>

        <Col sm={2}>
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
          <Button variant="danger" onClick={handleDeleteComment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
