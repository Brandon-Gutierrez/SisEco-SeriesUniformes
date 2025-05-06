import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MethodDetailPage from "./pages/MethodDetailPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/method/:methodId" element={<MethodDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App