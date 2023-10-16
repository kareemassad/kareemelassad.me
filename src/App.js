import 'bootstrap/dist/css/bootstrap.min.css'
import logo from './logo.svg';
import './App.scss';
import Header from './components/Header/Header';
import Projects from './components/Projects/Projects';
import ProjectCards from './components/ProjectCards/ProjectCards';
import Involvement from './components/Involvement/Involvement';
import Footer from './components/Footer/Footer';




function App() {
  return (
    <div className='app'>
      <Header />
      {/* <Projects /> */}
      {/* <ProjectCards /> */}
      {/* <Involvement /> */}
      <Footer />
    </div>
  );
}

export default App;
