// import logo from './logo.svg';
import './App.css';
import { Header, Footer, AnimalCard, 
  AnimalContainer, RegistrationForm, LoginForm, 
  NewsContainer, NewsFullCard, AnimalFullCard, 
  PartnerContainer, Profile, NotFound} from "./components";
import { ApiPage } from './pages';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <div>
      <AuthProvider>
        <Header/>
        <div className="app-footer">
          <div className='App'>
            <Routes>
              <Route path="/" element={<AnimalContainer/>}/>
              <Route path="/registration" element={<RegistrationForm/>}/>
              <Route path="/login" element={<LoginForm/>}/>
              <Route path="/news" element={<NewsContainer/>}/>
              <Route path="/news/:id" element={<NewsFullCard/>}/>
              <Route path="/animals/:id" element={<AnimalFullCard/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/partners" element={<PartnerContainer/>}/>
              <Route path="/apis" element={<ApiPage/>}/>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </div>
          <Footer/>
        </div>
      </AuthProvider>
    </div>
   
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
