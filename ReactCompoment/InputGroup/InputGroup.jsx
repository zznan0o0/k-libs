import React, {Component} from 'react';
import style from './InputGroup.css';

class InputGroup extends Component{
  render(){
    return (
      <div className={style['container']}>
        <div className={style.label} style={this.props.labelStyle}>{this.props.label}</div>
        <div className={style['input-container']}>{this.props.children}</div>
      </div>
    );
  }
}

export default InputGroup;