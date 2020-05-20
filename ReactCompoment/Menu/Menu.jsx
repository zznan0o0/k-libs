import React, { Component } from 'react';
import style from './Menu.css';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

class Menu extends Component {
  render() {
    return <ul className={style['menu']}>{this.props.children}</ul>;
  }
}

class MenuGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      on: props.on || 0
    };
  }

  open() {
    this.setState({
      on: this.state.on == 0 ? 1 : 0
    });
  }

  render() {
    return (
      <li
        onClick={() => this.open()}
        className={this.state.on == true ? style['on'] : ''}
      >
        <div className={style['title']}>
          <div className={style['content']}>
            <Icon type={this.props.icon || 'audit'} />
            <span className={style['span']}>{this.props.title || ''}</span>
          </div>
          {this.state.on == true ? <Icon type="minus" /> : <Icon type="plus" />}
        </div>
        <div
          style={{
            display: this.state.on == 1 ? 'block' : 'none'
          }}
        >
          {this.props.children}
        </div>
      </li>
    );
  }
}

class MenuGroupItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Link to={this.props.to}>
        <div
          onClick={e => this.props.onClick(e)}
          className={
            this.props.selected == true
              ? [style['menu-item'], style['on']].join(' ')
              : style['menu-item']
          }
        >
          {this.props.content}
        </div>
      </Link>
    );
  }
}

Menu.MenuGroup = MenuGroup;
Menu.MenuGroupItem = MenuGroupItem;

export default Menu;
export { Menu, MenuGroup, MenuGroupItem };
