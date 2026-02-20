import './App.scss';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import BellsPage from './components/BellsPage/BellsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/bells" element={<BellsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
