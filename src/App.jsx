// App.jsx
import { useRef } from 'react';
import Header from './components/header/header';
import MainText from './components/maintext/maintext';
import UsersSection from './components/userssection/userssection';
import RegistrationForm from './components/registrationform/registrationform';
import './App.scss';

function App() {
  const usersRef = useRef();

  return (
    <div className="app">
      <Header />
      <main>
        <MainText />
        {/* передаємо ref у UsersSection */}
        <UsersSection ref={usersRef} />
        {/* передаємо колбек у RegistrationForm */}
        <RegistrationForm onUserRegistered={() => usersRef.current.reload()} />
      </main>
    </div>
  );
}

export default App;
