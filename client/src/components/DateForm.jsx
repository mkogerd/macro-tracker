import React from 'react';

export default class DateForm extends React.Component {
  render() {
    return (
      <div>
	<button onClick={() => this.props.onDayChange(-1)} >Previous</button>
        <input type="date" value={this.props.date} onChange={this.props.onDateChange} />
        <button onClick={() => this.props.onDayChange(1)} >Next</button>
      </div>
    )
  }
}