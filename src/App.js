import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import Login from './Login';
import Registration from './components/Regisration';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import CourseDetails from './components/CourseDetails';
function App() {
  return (
    <div >
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/Login' element={<Login/>} />
        <Route path='/registration' element={<Registration/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/courseDetails' element={<CourseDetails/>} />

        
      </Routes>
    </div>
  );
}

export default App;
