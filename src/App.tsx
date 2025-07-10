import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Home";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/info" element={<div>Test</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
