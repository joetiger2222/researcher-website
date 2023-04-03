import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import Login from './Login';
import Registration from './components/Regisration';
import HomePage from './components/HomePage';
function App() {
  return (
    <div >
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/registration' element={<Registration/>} />
        <Route path='/HomePage' element={<HomePage/>} />
        
      </Routes>
    </div>
  );
}

export default App;
