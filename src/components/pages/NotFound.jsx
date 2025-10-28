import { Container } from 'react-bootstrap'

function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-4 text-danger">404</h1>
      <p className="lead">Página não encontrada 😕</p>
    </Container>
  )
}

export default NotFound
