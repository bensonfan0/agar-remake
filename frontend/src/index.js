import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import GameFront from './components/gameFront';
import reportWebVitals from './reportWebVitals';
//import { connect, play } from './networking/networking';

ReactDOM.render(
  <React.StrictMode>
    <GameFront />
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

