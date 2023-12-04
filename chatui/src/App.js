import React, { Profiler } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Chat } from './components/Chat';
import { Join } from './components/Join';

export default function App() {
  function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
    // Aggregate or log render timings...
    console.log(id, phase, actualDuration, baseDuration)
  }

  return (
    <Profiler id='app' onRender={onRender}>
    <Router>
      <Switch>
        <Route exact path="/" component={Join} />
        <Route exact path="/chat" component={Chat} />

      </Switch>
    </Router>
    </Profiler>
  );
}
