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

function Professores() {
  const { darkMode } = useContext(ThemeContext)

  const [professores, setProfessores] = useState([])
  const [filteredProfessores, setFilteredProfessores] = useState([])
  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    idade: '',
    formacao: '',
  })

  // 🧩 Busca inicial de professores
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const res = await api.get('/professores/')
        setProfessores(res.data)
        setFilteredProfessores(res.data)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfessores()
  }, [])

  // 🧩 Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 🧩 Abre modal (novo ou edição)
  const handleShowModal = (prof = null) => {
    if (prof) {
      setEditMode(true)
      setFormData(prof)
    } else {
      setEditMode(false)
      setFormData({ id: null, nome: '', idade: '', formacao: '' })
    }
    setShowModal(true)
  }

  // 🧩 Fecha modal
  const handleClose = () => setShowModal(false)

  // 🧩 Buscar por ID
  const handleSearch = async () => {
    if (!searchId) {
      setFilteredProfessores(professores)
      return
    }
    try {
      const res = await api.get(`/professores/${searchId}`)
      setFilteredProfessores([res.data])
    } catch (err) {
      alert('Professor não encontrado.')
      setFilteredProfessores([])
    }
  }

  // 🧩 Limpar filtro
  const handleClearFilter = () => {
    setFilteredProfessores(professores)
    setSearchId('')
  }

  // 🧩 Salvar (criar ou atualizar)
  const handleSave = async () => {
    try {
      if (!formData.nome || !formData.idade || !formData.formacao) {
        alert('Preencha todos os campos antes de salvar.')
        return
      }

      if (editMode) {
        await api.put('/professores/', {
          ...formData,
          idade: Number(formData.idade),
        })
        const updated = professores.map((p) =>
          p.id === formData.id ? formData : p
        )
        setProfessores(updated)
        setFilteredProfessores(updated)
        alert('Professor atualizado com sucesso!')
      } else {
        const res = await api.post('/professores/', {
          ...formData,
          idade: Number(formData.idade),
        })
        const newList = [...professores, res.data]
        setProfessores(newList)
        setFilteredProfessores(newList)
        alert('Professor adicionado com sucesso!')
      }

      setShowModal(false)
      setEditMode(false)
      setFormData({ id: null, nome: '', idade: '', formacao: '' })
    } catch (err) {
      alert('Erro ao salvar professor.')
      console.error(err)
    }
  }

  // 🧩 Excluir
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este professor?')) return
    try {
      await api.delete(`/professores/${id}`)
      const updated = professores.filter((p) => p.id !== id)
      setProfessores(updated)
      setFilteredProfessores(updated)
      alert('Professor excluído com sucesso!')
    } catch (err) {
      alert('Erro ao excluir professor.')
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
          Erro ao carregar professores.
        </Alert>
      </Container>
    )

  // 🧩 Interface (alinhamento igual ao de Alunos)
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary fw-bold mb-0">Lista de Professores</h2>

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

        <Button variant="success" onClick={() => handleShowModal()}>
          ➕ Novo Professor
        </Button>
      </div>

      {/* 🧾 Tabela */}
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
            <th>Formação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessores.length > 0 ? (
            filteredProfessores.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nome}</td>
                <td>{p.idade}</td>
                <td>{p.formacao}</td>
                <td>
                  <Button
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(p)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant={darkMode ? 'outline-danger' : 'danger'}
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑️ Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nenhum professor encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 📋 Modal CRUD */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>
            {editMode ? 'Editar Professor' : 'Novo Professor'}
          </Modal.Title>
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
              <Form.Label>Formação</Form.Label>
              <Form.Control
                type="text"
                name="formacao"
                value={formData.formacao}
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

export default Professores
