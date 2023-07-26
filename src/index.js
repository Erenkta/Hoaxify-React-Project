import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap-override.scss';
import * as serviceWorker from './serviceWorker';
import './i18n';
import App from './container/App';



ReactDOM.render(
  <div>
    <StrictMode>
      <App />
    </StrictMode>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*
    <ApiProgress>
      <LoginPage />   Bunu böyle yapmamızın sebebi Parent-Child ilişkisi kurduk artık Parent->Child'a parametre yollayabiliriz
    </ApiProgress>


    strict mode'u kendi ekletti
*/