import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from "./views/HomePage";
import SummonerPage from "./views/SummonerPage"

import './App.css';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" exact={true} element={<HomePage />}/>
        <Route path="/summoner" element={<SummonerPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
