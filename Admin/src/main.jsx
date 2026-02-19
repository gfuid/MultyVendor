import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux' // Redux Provider
import { store } from './redux/store'  // Jo store humne banaya

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider poori App ko data supply karega */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)