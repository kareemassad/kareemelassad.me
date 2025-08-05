import 'bootstrap/dist/css/bootstrap.min.css'
// import logo from './logo.svg';
import './App.scss';
import Header from './components/Header/Header';
// import Projects from './components/Projects/Projects';
// import Involvement from './components/Involvement/Involvement';
import Footer from './components/Footer/Footer';
import MainPage from './components/MainPage/MainPage';
import BellCollection from './components/BellCollection/BellCollection';




function App() {
  return (
    <div className='app'>
      <Header />
      <MainPage />
      <BellCollection />
      {/* <Projects /> */}
      {/* <ProjectCards /> */}
      {/* <Involvement /> */}
      <Footer />
    </div>
  );
}

export default App;
