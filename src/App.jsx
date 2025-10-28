import AppRouter from './router/AppRouter'

function App() {
  console.log('🔍 API URL usada:', import.meta.env.VITE_API_URL)
  return <AppRouter />
}

export default App
