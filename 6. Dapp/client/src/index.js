import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import App from './App';
import Admin from './components/Admin.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/admin" component={Admin} />
    </Switch>
  </Router>
);
