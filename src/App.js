import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import Login from './Login';
import Registration from './components/Regisration';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import CreateCourse from './components/CreateCourse';
import CourseDetails from './components/CourseDetails';
import AdminPanel from './components/AdminPanel';
import AddQuizToSection from './components/AddQuizToSection';

function App() {
  return (
    <div >
      <Routes>
        <Route path='/' element={<HomePage/>} />
        
        <Route path='/Login' element={<Login/>} />
        <Route path='/registration' element={<Registration/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/CreateCourse' element={<CreateCourse/>}/>
        <Route path='/CourseDetails/:id' element={<CourseDetails/>}/>
        <Route path='/AdminPanel' element={<AdminPanel/>}/>
        <Route path='/AddQuizToSection/:sectionId' element={<AddQuizToSection/>}/>
      

        

        
      </Routes>
    </div>
  );
}

export default App;
