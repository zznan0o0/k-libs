import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { HashRouter} from 'react-router-dom';

import Routes from 'Routes/Routes.jsx';
import Store from 'Redux/Store.js'

export default class App extends Component{
  render(){
    return (
      <Provider store={Store}>
        <HashRouter>
          <div>
            {Routes}
          </div>
        </HashRouter>
      </Provider>
    );
  }
}