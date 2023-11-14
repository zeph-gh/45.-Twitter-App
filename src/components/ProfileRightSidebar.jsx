import { useState, useEffect } from "react";
import { Col, Form, FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../features/posts/postsSlice";

export default function ProfileRightSideBar() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const searchResults = useSelector((state) => state.posts.searchResults);

  useEffect(() => {
    //search when typing
    if (searchTerm.trim() !== "") {
      dispatch(searchUser(searchTerm));
    } else {
      //only can cleanup like this
      dispatch(searchUser());
    }
  }, [dispatch, searchTerm]);

  return (
    <Col
      sm={2}
      className="d-flex flex-column justify-content-start align-items-start bg-light vh-100 pt-3"
      style={{ position: "sticky", top: 0 }}
    >
      <Form>
        <InputGroup className="mb-2">
          <InputGroup.Text className="rounded-start-5 bg-white">
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <FormControl
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-end-5 border-start-0"
          />
        </InputGroup>
      </Form>

      {searchResults && (
        <ListGroup className="mt-3">
          {searchResults.map((user) => (
            <ListGroup.Item key={user.id}>{user.username}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Col>
  );
}
