import React from 'react';
import { Chip, Avatar } from '@material-ui/core';

export default class DailyTotals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carb: 0,
      protein: 0,
      fat: 0,
      cal: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    // Update daily macro totals
    fetch('http://localhost:5000/totals?date='+nextProps.date, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => response.json())
      .then(json => {this.setState(json)});
  }


  render() {
    return (
      <div style={{ textAlign: 'center'}} >
        <Chip avatar={<Avatar style={{color: '#880000', background: '#FF6666'}}>P</Avatar>} label={this.state.protein+'g'}  />
        <Chip avatar={<Avatar style={{color: '#008800', background: '#66FF66'}}>C</Avatar>} label={this.state.carb+'g'}  />
        <Chip avatar={<Avatar style={{color: '#888800', background: '#FFFF66'}}>F</Avatar>} label={this.state.fat+'g'}  />
        <Chip avatar={<Avatar style={{color: '#000088', background: '#6666FF'}}>Cal</Avatar>} label={this.state.cal}  />
      </div>
    );
  }
}
