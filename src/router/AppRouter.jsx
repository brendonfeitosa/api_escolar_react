// Importações principais do React Router e Bootstrap
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Páginas
import Home from '../components/pages/Home'
import Alunos from '../components/pages/Alunos'
import Professores from '../components/pages/Professores'
import Materias from '../components/pages/Materias'
import Login from '../components/pages/Login'
import NotFound from '../components/pages/NotFound'
import Usuarios from '../components/pages/Usuarios'

// Layouts
import NavbarLayout from '../components/layouts/NavbarLayout'
import FooterLayout from '../components/layouts/FooterLayout'
import ProtectedLayout from '../components/layouts/ProtectedLayout'

// Contextos globais
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'

function AppRouter() {
  return (
    <BrowserRouter>
      {/* Contextos Globais: Autenticação + Tema */}
      <AuthProvider>
        <ThemeProvider>
          {/* Estrutura principal em coluna (Navbar, Conteúdo, Footer) */}
          <div className="d-flex flex-column min-vh-100">

            {/* Barra de navegação superior */}
            <NavbarLayout />

            {/* Conteúdo principal, cresce conforme a tela */}
            <div className="flex-grow-1">
              <Routes>
                {/* Páginas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Rotas protegidas */}
                <Route
                  path="/alunos"
                  element={
                    <ProtectedLayout>
                      <Alunos />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/professores"
                  element={
                    <ProtectedLayout>
                      <Professores />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/materias"
                  element={
                    <ProtectedLayout>
                      <Materias />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedLayout>
                      <Usuarios />
                    </ProtectedLayout>
                  }
                />

                {/* Página de erro 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Rodapé fixo em todas as páginas */}
            <FooterLayout />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRouter
