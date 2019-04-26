import React from 'react';

import { Router } from '@reach/router';

import Loading from './Loading';
import Login from './Login';
import Main from './Main';

const Routes: React.FC = () => {
  return (
    <Router style={{ height: '100%' }}>
      <Loading path="/" noThrow={true} />
      <Login path="login" noThrow={true} />
      <Main path="main" noThrow={true} />
    </Router>
  );
};

export default Routes;
