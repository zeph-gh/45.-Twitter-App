import { Container, Row } from 'react-bootstrap'
import ProfileMidBody from '../components/ProfileMidBody'
import ProfileSideBar from '../components/ProfileSidebar'

export default function ProfilePage() {
  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  )
}
