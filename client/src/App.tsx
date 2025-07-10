import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';
import { Button } from './components/ui/button';

function App() {
  const[resp, setResp] = useState<string>('');
  const nodeport = "8080"
  const pyport = "5000"

  const nodesubmit = () => {
  axios.get('http://localhost:' + nodeport).then((data) => {
    console.log(data)
    setResp(data.data)
  })
  }

  const pysubmit = () => {
    axios.get('http://localhost:' + pyport).then((data) => {
    console.log(data)
    setResp(data.data)
  })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={nodesubmit}>Submit</button>
        <Button>kjgbsdgkjdsb</Button>
        <button onClick={pysubmit}>Submit</button>
      <p>{resp}</p>
      </header>
    </div>
  );
}

export default App;

/////////////////////////


  