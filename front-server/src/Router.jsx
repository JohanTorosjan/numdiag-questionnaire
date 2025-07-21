import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './App.jsx';
import Questionnaire from './components/Questionnaire/questionnaire.jsx';
import login from './components/Login/login.jsx';

export default (
    <Route path="/" component={App}>
        {/* <IndexRoute component={login} /> */}
        <Route path="questionnaire/:id" component={Questionnaire} />
    </Route>
);