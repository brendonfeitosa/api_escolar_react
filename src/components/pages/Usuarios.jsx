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

function Usuarios() {
  const { darkMode } = useContext(ThemeContext)

  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    usuario: '',
    senha: '',
    ativo: '',
  })

  // 🧩 Busca inicial dos usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('/usuarios/')
        setUsuarios(res.data)
        setFilteredUsuarios(res.data)
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsuarios()
  }, [])

  // 🧩 Atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // 🧩 Abre modal (novo ou edição)
  const handleShowModal = (usuario = null) => {
    if (usuario) {
      setEditMode(true)
      setFormData(usuario)
    } else {
      setEditMode(false)
      setFormData({ id: null, usuario: '', senha: '', ativo: '' })
    }
    setShowModal(true)
  }

  // 🧩 Fecha modal
  const handleClose = () => setShowModal(false)

  // 🧩 Buscar usuário por ID
  const handleSearch = async () => {
    if (!searchId) {
      setFilteredUsuarios(usuarios)
      return
    }
    try {
      const res = await api.get(`/usuarios/${searchId}`)
      setFilteredUsuarios([res.data])
    } catch (err) {
      alert('Usuário não encontrado.')
      setFilteredUsuarios([])
    }
  }

  // 🧩 Limpar filtro
  const handleClearFilter = () => {
    setFilteredUsuarios(usuarios)
    setSearchId('')
  }

  // 🧩 Salvar (criar ou atualizar)
  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put('/usuarios/', formData)
        const updated = usuarios.map((u) =>
          u.id === formData.id ? formData : u
        )
        setUsuarios(updated)
        setFilteredUsuarios(updated)
        alert('Usuário atualizado com sucesso!')
      } else {
        const res = await api.post('/usuarios/', formData)
        const newList = [...usuarios, res.data]
        setUsuarios(newList)
        setFilteredUsuarios(newList)
        alert('Usuário adicionado com sucesso!')
      }

      setShowModal(false)
      setEditMode(false)
      setFormData({ id: null, usuario: '', senha: '', ativo: '' })
    } catch (err) {
      alert('Erro ao salvar usuário.')
      console.error(err)
    }
  }

  // 🧩 Excluir usuário
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return
    try {
      await api.delete(`/usuarios/${id}`)
      const updated = usuarios.filter((u) => u.id !== id)
      setUsuarios(updated)
      setFilteredUsuarios(updated)
      alert('Usuário excluído com sucesso!')
    } catch (err) {
      alert('Erro ao excluir usuário.')
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
          Erro ao carregar usuários.
        </Alert>
      </Container>
    )

  // 🧩 Tabela + layout centralizado
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-primary fw-bold mb-0">Lista de Usuários</h2>

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
          ➕ Novo Usuário
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
            <th>Usuário</th>
            <th>Senha</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.length > 0 ? (
            filteredUsuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.usuario}</td>
                <td>{u.senha}</td>
                <td>{u.ativo ? 'Ativo' : 'Inativo'}</td>
                <td>
                  <Button
                    variant={darkMode ? 'outline-light' : 'outline-primary'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(u)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant={darkMode ? 'outline-danger' : 'danger'}
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    🗑️ Excluir
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🧩 Modal CRUD */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className={darkMode ? 'bg-dark text-light' : ''}
        >
          <Modal.Title>
            {editMode ? 'Editar Usuário' : 'Novo Usuário'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Usuário</Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className={darkMode ? 'bg-secondary text-light border-0' : ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={darkMode ? 'bg-secondary text-light border-0' : ''}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status (1 = ativo, 0 = inativo)</Form.Label>
              <Form.Control
                type="number"
                name="ativo"
                value={formData.ativo}
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

export default Usuarios
