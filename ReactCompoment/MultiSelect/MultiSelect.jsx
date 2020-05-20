import React, { Component } from 'react';
import style from './MultiSelect.css';

class MultiSelect extends Component {
  state = {
    selectVal: [],
    isSearch: true,
    focus: 'none',
    resource: []
  };

  constructor(props) {
    super(props);
    window.addEventListener('mouseup', this.blur, false);
  }

  componentWillReceiveProps(nextProps) {
    this.state.resource = nextProps.resource;
    this.state.resource.forEach(v => {
      v['display'] = 'block';
    });
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.blur, false);
    clearTimeout(this.state.timeout_id);
  }

  componentDidMount() {
    this.state.resource = this.props.resource || [];
    this.state.resource.forEach(v => {
      v['display'] = 'block';
    });
  }

  blur = () => {
    this.setState({
      focus: 'none'
    });
  };

  onClick(e) {
    let input_text = [];
    if (this.props.mode == 'radio') {
      this.state.resource.forEach(item => {
        if (item.value == e.target.dataset.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }

        if (item.checked == true) {
          input_text.push(item.label);
        }
      });
    } else {
      this.state.resource.forEach(item => {
        if (item.value == e.target.dataset.value) {
          item.checked = !item.checked;
        }

        if (item.checked == true) {
          input_text.push(item.label);
        }
      });
    }

    this.refs.MultiSelectInput.value = input_text.join(',');

    this.setState({});
    this.props.onChange && this.props.onChange({ ...this.state.resource });
  }

  search(e) {
    if (this.state.isSearch) {
      this.state.isSearch = false;
      let timeout_id = setTimeout(
        target => {
          let value = target.value;
          this.state.resource.forEach(v => {
            if (value === '' || v['label'].indexOf(value) > -1) {
              v['display'] = 'block';
            } else {
              v['display'] = 'none';
            }
          });
          this.setState({ isSearch: true, timeout_id: timeout_id });
        },
        300,
        e.target
      );
    }
  }

  checkedAll() {
    let input_text = [];
    this.state.resource.forEach(item => {
      item.checked = true;
      input_text.push(item.label);
    });
    this.refs.MultiSelectInput.value = input_text.join(',');
    this.setState({});
  }

  uncheckAll() {
    this.state.resource.forEach(item => {
      item.checked = false;
    });
    this.refs.MultiSelectInput.value = '';
    this.setState({});
  }

  focus() {
    this.setState({
      focus: 'inline-block'
    });
  }

  render() {
    let operation_btn =
      this.props.mode == 'radio' ? (
        ''
      ) : (
        <div className={style['check-container']}>
          <button onClick={this.checkedAll.bind(this)} className={style['btn']}>
            全选
          </button>
          <button onClick={this.uncheckAll.bind(this)} className={style['btn']}>
            全部取消
          </button>
        </div>
      );

    return (
      <div onClick={this.focus.bind(this)} className={style['relative']}>
        <input
          readOnly
          ref="MultiSelectInput"
          type="text"
          style={this.props.style}
          className={this.props.className}
        />
        <div style={{ display: this.state.focus }} className={style.container}>
          <div className={style['search-box']}>
            <input
              onKeyUp={this.search.bind(this)}
              className={style['search-input']}
              type="text"
            />
          </div>
          {operation_btn}
          <ul className={style['ul']}>
            {this.state.resource &&
              this.state.resource.map(item => (
                <li
                  className={item.checked == true ? style['on'] : ''}
                  onClick={this.onClick.bind(this)}
                  data-value={item.value}
                  key={item.value}
                  style={{ display: item.display }}
                >
                  {item.label}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default MultiSelect;
