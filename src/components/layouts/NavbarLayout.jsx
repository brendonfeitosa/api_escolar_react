import { useContext } from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { AuthContext } from '../../context/AuthContext'

function NavbarLayout() {
  const { user, logout } = useContext(AuthContext)

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>📚 Sistema Escolar</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user && (
            <Nav className="me-auto">
              <LinkContainer to="/"><Nav.Link>Início</Nav.Link></LinkContainer>
              <LinkContainer to="/alunos"><Nav.Link>Alunos</Nav.Link></LinkContainer>
              <LinkContainer to="/professores"><Nav.Link>Professores</Nav.Link></LinkContainer>
              <LinkContainer to="/materias"><Nav.Link>Matérias</Nav.Link></LinkContainer>
              <LinkContainer to="/usuarios"><Nav.Link>Usuários</Nav.Link></LinkContainer>
            </Nav>
          )}

          <Nav className="ms-auto">
            {user ? (
              <>
                <Navbar.Text className="me-3 text-light">
                  👋 Olá, <strong>{user.username}</strong>
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={logout}>
                  Sair
                </Button>
              </>
            ) : (
              <LinkContainer to="/login">
                <Button variant="outline-light" size="sm">Login</Button>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarLayout
