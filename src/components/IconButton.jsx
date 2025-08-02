import { Button } from 'react-bootstrap'

export default function IconButton({ isTop, className, onClick, text }) {
  return (
    <Button variant={`light rounded-pill`} onClick={onClick}>
      <i
        className={className}
        style={{ fontSize: '24px', color: isTop ? 'dodgerblue' : 'black' }}
      ></i>
      {text}
    </Button>
  )
}
