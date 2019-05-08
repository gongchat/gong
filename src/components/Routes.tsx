import React, { FC } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Loading from './Loading';
import Login from './Login';
import Main from './Main';

const Routes: FC = () => {
  return (
    <Router>
      <Route path="/" exact component={Loading} />
      <Route path="/login" component={Login} />
      <Route path="/main" component={Main} />
    </Router>
  );
};

export default Routes;
