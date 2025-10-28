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

function Materias() {
  const { darkMode } = useContext(ThemeContext)

  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    sigla_curricular: '',
    descricao: '',
  })
  const [searchId, setSearchId] = useState('')
  const [filteredMaterias, setFilteredMaterias] = useState([])

  // 🧩 Busca inicial das matérias
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const res = await api.get('/materias/')
        setMaterias(res.data)
        setFilteredMaterias(res.data)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMaterias()
  }, [])

  // 🧩 Abre modal (novo ou edição)
  const handleShowModal = (materia = null) => {
    if (materia) {
      setEditMode(true)
      setFormData(materia)
    } else {
      setEditMode(false)
      setFormData({ id: null, nome: '', sigla_curricular: '', descricao: '' })
    }
    setShowModal(true)
  }

  // 🧩 Fecha modal
  const handleClose = () => setShowModal(false)

  // 🧩 Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 🧩 Buscar matéria por ID
  const handleSearch = async () => {
    if (!searchId) {
      setFilteredMaterias(materias)
      return
    }
    try {
      const res = await api.get(`/materias/${searchId}`)
      setFilteredMaterias([res.data])
    } catch (err) {
      alert('Matéria não encontrada.')
      setFilteredMaterias([])
    }
  }

  // 🧩 Limpar filtro e mostrar tudo
  const handleClearFilter = () => {
    setFilteredMaterias(materias)
    setSearchId('')
  }

  // 🧩 Salvar (criar ou atualizar)
  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put('/materias/', formData)
        const updated = materias.map((m) =>
          m.id === formData.id ? formData : m
        )
        setMaterias(updated)
        setFilteredMaterias(updated)
        alert('Matéria atualizada com sucesso!')
      } else {
        const res = await api.post('/materias/', formData)
        const newList = [...materias, res.data]
        setMaterias(newList)
        setFilteredMaterias(newList)
        alert('Matéria adicionada com sucesso!')
      }

      setShowModal(false)
      setEditMode(false)
      setFormData({ id: null, nome: '', sigla_curricular: '', descricao: '' })
    } catch (err) {
      alert('Erro ao salvar matéria.')
      console.error(err)
    }
  }

  // 🧩 Remover matéria
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta matéria?')) return
    try {
      await api.delete(`/materias/${id}`)
      const updated = materias.filter((m) => m.id !== id)
      setMaterias(updated)
      setFilteredMaterias(updated)
      alert('Matéria excluída com sucesso!')
    } catch (err) {
      alert('Erro ao excluir matéria.')
      console.error(err)
    }
  }

  // 🧩 Loading / erro
  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant={darkMode ? 'light' : 'primary'} />
      </div>
    )

  if (error)
    return (
      <Alert variant={darkMode ? 'dark' : 'danger'} className="mt-4">
        Erro ao carregar matérias.
      </Alert>
    )

  // 🧩 Tabela + Busca
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary mb-0">Lista de Matérias</h2>

        <div className="d-flex gap-2">
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
          ➕ Nova Matéria
        </Button>
      </div>

      {/* Lista de matérias (filtrada ou completa) */}
      <Table
        striped
        bordered
        hover
        responsive
        className={`align-middle shadow-sm ${
          darkMode ? 'table-dark table-striped' : ''
        }`}
      >
        <thead className={darkMode ? 'table-secondary' : 'table-light'}>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Sigla Curricular</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterias.length > 0 ? (
            filteredMaterias.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nome}</td>
                <td>{m.sigla_curricular}</td>
                <td>{m.descricao}</td>
                <td>
                  <Button
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(m)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant={darkMode ? 'outline-danger' : 'danger'}
                    size="sm"
                    onClick={() => handleDelete(m.id)}
                  >
                    🗑️ Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nenhuma matéria encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🧩 Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>{editMode ? 'Editar Matéria' : 'Nova Matéria'}</Modal.Title>
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
              <Form.Label>Sigla Curricular</Form.Label>
              <Form.Control
                type="text"
                name="sigla_curricular"
                value={formData.sigla_curricular}
                onChange={handleChange}
                className={darkMode ? 'bg-secondary text-light border-0' : ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                name="descricao"
                value={formData.descricao}
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

export default Materias
