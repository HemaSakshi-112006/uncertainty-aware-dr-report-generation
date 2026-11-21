import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Compare from "./pages/Compare";
import History from "./pages/History";

function App() {
  return (
    <DarkModeProvider>
      <AnalysisProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </BrowserRouter>
      </AnalysisProvider>
    </DarkModeProvider>
  );
}

export default App;
