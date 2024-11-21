import './App.css';
import * as Components from "./components";
import { ApiPage, HomePage } from './pages';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <div>
      <AuthProvider>
        <Components.Header/>
        <div className="app-footer">
          <div className='App'>
            <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/add-animal" element={<Components.AddAnimalForm/>}/>
              <Route path="/edit-animal" element={<Components.EditAnimalForm/>}/>
              <Route path="/registration" element={<Components.RegistrationForm/>}/>
              <Route path="/login" element={<Components.LoginForm/>}/>
              <Route path="/news" element={<Components.NewsContainer/>}/>
              <Route path="/news/:id" element={<Components.NewsFullCard/>}/>
              <Route path="/animals/:id" element={<Components.AnimalFullCard/>}/>
              <Route path="/profile" element={<Components.Profile/>}/>
              <Route path="/partners" element={<Components.PartnerContainer/>}/>
              <Route path="/apis" element={<ApiPage/>}/>
              <Route path="*" element={<Components.NotFound />}/>
            </Routes>
          </div>
          <Components.Footer/>
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
