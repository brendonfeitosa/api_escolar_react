import { Container } from 'react-bootstrap'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

function FooterLayout() {
  const { user } = useContext(AuthContext)
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container className="text-center">
        <small>
          © {ano} Sistema Escolar — Desenvolvido por Brendon Feitosa
          {user && (
            <>
              <span className="text-secondary"> | </span>
              <span>Usuário: <strong>{user.username}</strong></span>
            </>
          )}
        </small>
      </Container>
    </footer>
  )
}

export default FooterLayout
