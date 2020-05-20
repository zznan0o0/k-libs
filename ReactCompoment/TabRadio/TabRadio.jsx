import React, {Component} from 'react';
import style from './TabRadio.css';
class TabRadio extends Component{
  constructor(props){
    super(props);
    this.state = {...props}
  }

  click(e){
    let value = e.currentTarget.getAttribute('value');
    this.state.dataSource.forEach((item) => {
      item['checked'] = false;
      if(item['value'] == value )
        item['checked'] = true;
    });
    this.setState({});

    this.props.onChange && this.props.onChange(this.state.dataSource);
  }

  render(){
    return (
      <div className={style['tabradio-container']}>
        {
          this.state.dataSource.map((v) => {
            return <div value={v['value']} onClick={(e) => this.click(e)} className={v['checked'] ? style['on'] : ''} key={v['value']}>{v['label']}</div>
          })
        }
        {this.props.children}
      </div>
    );
  }
}

export default TabRadio;