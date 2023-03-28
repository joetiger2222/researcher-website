import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import Login from './Login';
function App() {
  return (
    <div >
      <Routes>
        <Route path='/' element={<Login/>} />
      </Routes>
    </div>
  );
}

export default App;
