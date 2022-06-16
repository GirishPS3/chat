import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Chat } from './components/Chat';
import { Join } from './components/Join';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Join} />
        <Route exact path="/chat" component={Chat} />

      </Switch>
    </Router>
  );
}
