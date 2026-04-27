import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PautaList } from './pages/PautaList';
import { PautaCreate } from './pages/PautaCreate';
import { PautaDetail } from './pages/PautaDetail';
import { VotingPage } from './pages/Voting';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pautas" element={<PautaList />} />
          <Route path="/pautas/nova" element={<PautaCreate />} />
          <Route path="/pautas/:id" element={<PautaDetail />} />
          <Route path="/votacao/:id" element={<VotingPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;