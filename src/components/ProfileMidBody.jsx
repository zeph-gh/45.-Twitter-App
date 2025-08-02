import { Button, Col, Image, Nav, Row, Spinner } from 'react-bootstrap'
import ProfilePostCard from './ProfilePostCard'
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsByUser } from '../features/posts/postsSlice'
import { AuthContext } from './AuthProvider'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function ProfileMidBody() {
  //the fetch from redux
  const dispatch = useDispatch() //sender
  //receiver
  const posts = useSelector((state) => state.posts.posts)
  const loading = useSelector((state) => state.posts.loading)
  const [username, setUsername] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchPostsByUser(currentUser.uid))
      setUsername(currentUser.displayName || '')

      setProfileImage(currentUser.photoURL)
      setProfileLoading(false)
    }
  }, [dispatch, currentUser])

  return (
    <Col
      sm={6}
      className="bg-light py-4"
      style={{ border: '1px solid lightgrey' }}
    >
      {profileLoading ? (
        <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
      ) : (
        <>
          <Image
            src={profileImage}
            roundedCircle
            style={{
              height: 100,
              width: 100,
              border: '4px solid #F8F9FA',
              marginLeft: 15,
            }}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://picsum.photos/200/300'
            }}
          />

          <p
            className="my-4"
            style={{ margin: 0, fontWeight: 'bold', fontSize: '15px' }}
          >
            @{username}
          </p>
        </>
      )}

      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && (
        <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
      )}
      {posts.length > 0 &&
        posts.map((post) => <ProfilePostCard key={post.id} post={post} />)}
    </Col>
  )
}
