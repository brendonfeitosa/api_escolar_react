import { useState, useContext } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'

function Login() {
  const { login } = useContext(AuthContext)
  const { darkMode } = useContext(ThemeContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(username, password)
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
    >
      <Card
        className={`p-4 shadow-lg border-0 ${
          darkMode ? 'bg-dark text-light' : 'bg-light text-dark'
        }`}
        style={{ width: '400px', transition: 'all 0.3s ease' }}
      >
        <h3 className="text-center mb-3 text-primary">Acesso ao Sistema</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuário</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={darkMode ? 'bg-secondary text-light border-0' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={darkMode ? 'bg-secondary text-light border-0' : ''}
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              variant={darkMode ? 'outline-light' : 'primary'}
              type="submit"
            >
              Entrar
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  )
}

export default Login
