import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import UnicodePage from "./pages/UnicodePage"
import ImagePage from "./pages/ImagePage"
import TextPage from "./pages/TextPage"
import AudioPage from "./pages/AudioPage"
import MetadataPage from "./pages/MetadataPage"
import QRPage from "./pages/QRPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/unicode" element={<UnicodePage />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/text" element={<TextPage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/metadata" element={<MetadataPage />} />
        <Route path="/qr" element={<QRPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App