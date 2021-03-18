import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider as StoreProvider } from 'react-redux';
// import appSettings from '@config/app-settings';
// import App from './core/components/App';
// import store from './store';

// Set debug in localStorage
// if (process.env.NODE_ENV !== 'production') {
//   localStorage.setItem('debug', `${appSettings.debugPrefix}:*`);
// }

// Render application
const appElm = document.getElementById('root');

// App with store
const app = (
  <h1>Hello World!</h1>
  // <StoreProvider store={store}>
  //   <App />
  // </StoreProvider>
);

ReactDOM.render(app, appElm);
