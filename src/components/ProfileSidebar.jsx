import { Button, Col } from 'react-bootstrap'
import IconButton from '../components/IconButton'
import { useState } from 'react'
import NewPostModal from './NewPostModal'
import { useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'

export default function ProfileSideBar() {
  const navigate = useNavigate()

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleLogout = async () => {
    const auth = getAuth()

    await auth.signOut()
    navigate('/login')
  }

  return (
    <Col
      sm={2}
      className="d-flex flex-column bg-light vh-100 py-4"
      style={{ position: 'sticky', top: 0 }}
    >
      <IconButton className="bi bi-twitter" isTop />
      <Button
        className="rounded-pill w-100 my-3 fw-medium p-2"
        onClick={handleShow}
      >
        Tweet
      </Button>
      <div className="mt-auto">
        <IconButton
          className="bi bi-door-closed "
          text="Logout"
          onClick={() => handleLogout()}
        />
      </div>

      <NewPostModal show={show} handleClose={handleClose} />
    </Col>
  )
}
