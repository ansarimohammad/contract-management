import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { BlueprintBuilder } from './pages/BlueprintBuilder';
import { CreateContract } from './pages/CreateContract';
import { ContractDetails } from './pages/ContractDetails';
import { Layout } from './components/Layout';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blueprints/new" element={<BlueprintBuilder />} />
          <Route path="/contracts/new" element={<CreateContract />} />
          <Route path="/contracts/:id" element={<ContractDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
