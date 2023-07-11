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
import SectionQuiz from './components/SectionQuiz';
import CourseForStudent from './components/CourseForStudent';
import AddQuizToCourse from './components/AddQuizToCourse'
import FinalQuiz from './components/FinalQuiz';
import AddPaper from './components/AddPaper';
import FailedFinalQuiz from './components/FailedFinalQuiz';
import MarketPlace from './components/MarketPlace';
import Idea from './components/Idea';
import Researchers from './components/Researchers';
import RegisterationSpecialAccount from './components/RegisterationSpecialAccount';
import SuccededFinalQuiz from './components/SuccededFinalQuiz';
import AssignStudentToCourse from './components/AssignStudentToCourse';
import RateIdeaResearchers from './components/RateIdeaResearchers';
import BuyCourse from './components/BuyCourse';
import AllFinalQuizes from './components/AllFinalQuizes';
import UploadFinalTask from './components/UploadFinalTask';
import { MyProvider } from './Users/Redux';
function App() {
  return (
    <MyProvider>
    <div >
      <Routes>
        
        <Route path='/' element={<Login/>} />
        <Route path='/HomePage' element={<HomePage/>} />
        <Route path='/registration' element={<Registration/>} />
        <Route path='/profile/:studentId' element={<Profile/>} />
        <Route path='/CreateCourse' element={<CreateCourse/>}/>
        <Route path='/CourseDetails/:id' element={<CourseDetails/>}/>
        <Route path='/AdminPanel' element={<AdminPanel/>}/>
        <Route path='/AddQuizToSection/:sectionId' element={<AddQuizToSection/>}/>
        <Route path='/SectionQuiz/:sectionId' element={<SectionQuiz/>}/>
        <Route path='/CourseForStudent/:sectionId/:videoId' element={<CourseForStudent/>}/>
        <Route path='/AddQuizToCourse/:skillId' element={<AddQuizToCourse/>}/>
        <Route path='/FinalQuiz/:skillId' element={<FinalQuiz/>}/>
        <Route path='/FailedFinalQuiz/:skillId' element={<FailedFinalQuiz/>}/>
        <Route path='/SuccededFianlQuiz' element={<SuccededFinalQuiz/>}/>
        <Route path='/AddPaper' element={<AddPaper/>}/>
        <Route path='/MarketPlace' element={<MarketPlace/>}/>
        <Route path='/Idea/:ideaId' element={<Idea/>}/>
        <Route path='/Researchers' element={<Researchers/>}/>
        <Route path='/RegisterationSpecialAccount' element={<RegisterationSpecialAccount/>}/>
        <Route path='/AssignStudentToCourse' element={<AssignStudentToCourse/>}/>
        <Route path='/RateIdeaResearchers/:ideaId' element={<RateIdeaResearchers/>}/>
        <Route path='/BuyCourse' element={<BuyCourse/>}/>
        <Route path='/AllFinalQuizes/:skillId' element={<AllFinalQuizes/>}/>
        <Route path='/UploadFinalTask/:taskId' element={<UploadFinalTask/>}/>
      

      </Routes>
    </div>
     </MyProvider>
  );
}

export default App;
