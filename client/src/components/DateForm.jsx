import React from 'react';
import { TextField, Button } from '@material-ui/core';
import NavigateNext from '@material-ui/icons/NavigateNextRounded';
import NavigateBefore from '@material-ui/icons/NavigateBeforeRounded';



export default class DateForm extends React.Component {
  render() {
    return (
      <div>
        <Button onClick={() => this.props.onDayChange(-1)}><NavigateBefore /></Button>
        <TextField type="date" value={this.props.date} onChange={this.props.onDateChange} />
	    <Button onClick={() => this.props.onDayChange(1)}><NavigateNext /></Button>
      </div>
    )
  }
}