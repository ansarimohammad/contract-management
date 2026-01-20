import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from './components/Layout';
import { Dashboard } from "./pages/Dashboard";
import { CreateContract } from './pages/CreateContract';
import { BlueprintBuilder } from "./pages/BlueprintBuilder";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blueprints/new" element={<BlueprintBuilder />} />
          <Route path="/contracts/new" element={<CreateContract />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
