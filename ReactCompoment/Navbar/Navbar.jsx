import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  render() {
    return (
      <ul>
        <li><Link to="/">首页1</Link></li>
      </ul>
    );
  }
}