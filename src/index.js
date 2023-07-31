import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap-override.scss';
import * as serviceWorker from './serviceWorker';
import './i18n';
import App from './container/App';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import configureStore from './redux/configureStore';



const store = configureStore() //state objesi vermek zorundayız

ReactDOM.render(

  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
  , document.getElementById('root')

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
