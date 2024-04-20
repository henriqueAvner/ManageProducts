import { Route, Routes } from 'react-router-dom';

import './App.css';
import FrontPage from './pages/FrontPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <FrontPage /> } />
    </Routes>
  );
}

export default App;
