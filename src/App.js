import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import Login from './Login';
import Registration from './components/Regisration';
function App() {
  return (
    <div >
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/registration' element={<Registration/>} />

      </Routes>
    </div>
  );
}

export default App;
