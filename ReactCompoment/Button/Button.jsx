import React, {Component} from 'react';
import style from './Button.css';

class Button extends Component{
  render(){
    return (
      <button {...this.props} className={style['btn']}>{this.props.children}</button>
    );
  }
}


class ButtonRadius extends Component{
  render(){
    return (
      <button {...this.props} className={[style['btn'], style['btn-radius']].join(' ')}>{this.props.children}</button>
    );
  }
}
class ButtonDanger extends Component{
  render(){
    return (
      <button {...this.props} className={[style['btn'], style['danger']].join(' ')}>{this.props.children}</button>
    );
  }
}

export default Button;
export {
  Button,
  ButtonRadius,
  ButtonDanger,
}