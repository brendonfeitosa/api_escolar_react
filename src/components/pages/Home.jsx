import { Container } from 'react-bootstrap'
import homeImg from '../../img/home.png' // ✅ Importa a imagem corretamente

function Home() {
  return (
    <Container className="mt-5 text-center">
      <h1 className="text-primary mb-3">Bem-vindo ao Sistema Escolar</h1>
      <p className="mb-4">
        Gerencie alunos, professores e matérias de forma simples e eficiente.
      </p>
      {/* ✅ Exibe a imagem centralizada e responsiva */}
      <img
        src={homeImg}
        alt="Tela inicial do Sistema Escolar"
        className="img-fluid rounded shadow-lg"
        style={{ maxWidth: '800px' }}
      />
    </Container>
  )
}

export default Home
