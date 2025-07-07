import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const[resp, setResp] = useState<string>('');

  const submit = () => {
  axios.get('http://localhost:5000').then((data) => {
    setResp(data.data)
  })
}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={submit}>Submit</button>
      <p>{resp}</p>
      </header>
    </div>
  );
}

export default App;

/////////////////////////


  