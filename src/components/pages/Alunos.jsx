import { useState, useContext, useEffect } from 'react'
import {
  Table,
  Spinner,
  Alert,
  Container,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import { ThemeContext } from '../../context/ThemeContext'
import api from '../../api/api'

function Alunos() {
  const { darkMode } = useContext(ThemeContext)

  const [alunos, setAlunos] = useState([])
  const [filteredAlunos, setFilteredAlunos] = useState([])
  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    idade: '',
    cpf: '',
  })

  // 🧩 Busca inicial dos alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const res = await api.get('/alunos/')
        setAlunos(res.data)
        setFilteredAlunos(res.data)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlunos()
  }, [])

  // 🧩 Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 🧩 Abre modal (novo ou edição)
  const handleShowModal = (aluno = null) => {
    if (aluno) {
      setEditMode(true)
      setFormData(aluno)
    } else {
      setEditMode(false)
      setFormData({ id: null, nome: '', idade: '', cpf: '' })
    }
    setShowModal(true)
  }

  // 🧩 Fecha modal
  const handleClose = () => setShowModal(false)

  // 🧩 Buscar aluno por ID
  const handleSearch = async () => {
    if (!searchId) {
      setFilteredAlunos(alunos)
      return
    }
    try {
      const res = await api.get(`/alunos/${searchId}`)
      setFilteredAlunos([res.data])
    } catch (err) {
      alert('Aluno não encontrado.')
      setFilteredAlunos([])
    }
  }

  // 🧩 Limpar filtro
  const handleClearFilter = () => {
    setFilteredAlunos(alunos)
    setSearchId('')
  }

  // 🧩 Salvar (criar ou atualizar)
  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put('/alunos/', formData)
        const updated = alunos.map((a) =>
          a.id === formData.id ? formData : a
        )
        setAlunos(updated)
        setFilteredAlunos(updated)
        alert('Aluno atualizado com sucesso!')
      } else {
        const res = await api.post('/alunos/', formData)
        const newList = [...alunos, res.data]
        setAlunos(newList)
        setFilteredAlunos(newList)
        alert('Aluno adicionado com sucesso!')
      }

      setShowModal(false)
      setEditMode(false)
      setFormData({ id: null, nome: '', idade: '', cpf: '' })
    } catch (err) {
      alert('Erro ao salvar aluno.')
      console.error(err)
    }
  }

  // 🧩 Excluir aluno
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este aluno?')) return
    try {
      await api.delete(`/alunos/${id}`)
      const updated = alunos.filter((a) => a.id !== id)
      setAlunos(updated)
      setFilteredAlunos(updated)
      alert('Aluno excluído com sucesso!')
    } catch (err) {
      alert('Erro ao excluir aluno.')
      console.error(err)
    }
  }

  // 🧩 Loading / erro
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant={darkMode ? 'light' : 'primary'} />
      </div>
    )

  if (error)
    return (
      <Container className="mt-4">
        <Alert
          variant={darkMode ? 'dark' : 'danger'}
          className="text-center shadow-sm"
        >
          Erro ao carregar alunos.
        </Alert>
      </Container>
    )

  // 🧩 Tabela + layout centralizado
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary fw-bold mb-0">Lista de Alunos</h2>

        <div className="d-flex gap-2 align-items-center">
          <Form.Control
            type="number"
            placeholder="Buscar por ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ width: '150px' }}
          />
          <Button variant="info" onClick={handleSearch}>
            🔍 Buscar
          </Button>
          <Button
            variant={darkMode ? 'outline-warning' : 'warning'}
            onClick={handleClearFilter}
          >
            ❌ Limpar filtro
          </Button>
        </div>

        {/* 🔹 Botão idêntico ao de Matérias */}
        <Button variant="success" onClick={() => handleShowModal()}>
          ➕ Novo Aluno
        </Button>
      </div>

      {/* 🧩 Tabela */}
      <Table
        striped
        bordered
        hover
        responsive
        className={`align-middle shadow-sm ${
          darkMode ? 'table-dark table-striped' : ''
        }`}
      >
        <thead className={darkMode ? 'table-secondary' : 'table-primary'}>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlunos.length > 0 ? (
            filteredAlunos.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nome}</td>
                <td>{a.idade}</td>
                <td>{a.cpf}</td>
                <td>
                  <Button
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(a)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant={darkMode ? 'outline-danger' : 'danger'}
                    size="sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    🗑️ Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nenhum aluno encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🧩 Modal CRUD */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>{editMode ? 'Editar Aluno' : 'Novo Aluno'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={darkMode ? 'bg-secondary text-light border-0' : ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Idade</Form.Label>
              <Form.Control
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                className={darkMode ? 'bg-secondary text-light border-0' : ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CPF</Form.Label>
              <Form.Control
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={darkMode ? 'bg-secondary text-light border-0' : ''}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark text-light' : ''}>
          <Button
            variant={darkMode ? 'outline-light' : 'secondary'}
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            variant={darkMode ? 'outline-success' : 'success'}
            onClick={handleSave}
          >
            {editMode ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Alunos
