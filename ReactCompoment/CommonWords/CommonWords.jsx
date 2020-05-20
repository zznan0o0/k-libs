import React, { Component } from 'react';

import Button from 'Components/Button/Button.jsx';

import style from './CommonWords.css';

import KString from 'Libs/KString.js';

const kString = new KString();

class CommonWords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: props.resource || [],
      size: 1
    };
  }

  onInputKeyUp(e) {
    this.setState({ size: kString.len(e.currentTarget.value) + 1 });
  }

  focusInput(e) {
    e.stopPropagation();
    this.refs.input.select();
  }

  onSave(e) {
    this.props.onSave && this.props.onSave(this.state.resource);
  }

  onEnter(e) {
    if (e.keyCode == 13) {
      this.onFocusout(e);
    }
  }

  onFocusout(e) {
    let value = e.currentTarget.value;
    if (value !== '') {
      this.state.resource.push(value);
      this.setState({ size: 1 });
      e.currentTarget.value = '';
    }
  }

  onOff(e) {
    e.stopPropagation();
    this.state.resource.splice(e.currentTarget.dataset.id, 1);
    this.setState({});
  }

  onClick(e) {
    let input = document.querySelector('[data-commonword="1"]');
    if (input) {
      input.value = e.currentTarget.dataset.val;
    }
  }

  render() {
    return (
      <div className={style['container']}>
        <span className={style['title']}>常用词：</span>
        <div
          onClick={this.focusInput.bind(this)}
          className={style['input-box']}
        >
          {this.state.resource.map((v, k) => {
            return (
              <span
                onMouseDown={this.onClick.bind(this)}
                data-val={v}
                key={k}
                className={style['tag']}
              >
                <span>{v}</span>
                <span
                  onClick={this.onOff.bind(this)}
                  data-id={k}
                  className={style['tag-off']}
                />
              </span>
            );
          })}
          <input
            onKeyUp={this.onInputKeyUp.bind(this)}
            onBlur={this.onFocusout.bind(this)}
            onKeyDown={this.onEnter.bind(this)}
            ref="input"
            size={this.state.size}
            className={style['input']}
            type="text"
          />
        </div>
        <Button onClick={this.onSave.bind(this)} style={{ lineHeight: '32px' }}>
          保存常用词
        </Button>
      </div>
    );
  }
}

class Input extends Component {
  onFocus(e) {
    e.currentTarget.dataset.commonword = '1';
  }

  onBlur(e) {
    e.currentTarget.dataset.commonword = '0';
    this.props.onChange(e);
  }

  render() {
    return (
      <input
        {...this.props}
        data-commonword="0"
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
      />
    );
  }
}

CommonWords.Input = Input;
export default CommonWords;
export { CommonWords, Input };
