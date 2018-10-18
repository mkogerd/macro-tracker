import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { NewFoodForm, LoginMenu, RecordTable } from './components';
import LoginMenu from './components/LoginMenu';
import RecordTable from './components/RecordTable';
import DateForm from './components/DateForm';
import DailyTotals from './components/DailyTotals';
import BottomNav from './components/BottomNav';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      date: getDate(),
      loggedIn: false,
     };

     this.handleDayChange = this.handleDayChange.bind(this);
     this.handleDelete = this.handleDelete.bind(this);
     this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleLogin() {
    this.setState({loggedIn: true});
    this.handleUpdate();
  }

  handleUpdate() {
    // Update daily meal record
    fetch('http://localhost:5000/records?date='+this.state.date, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => response.json())
      .then(json => {this.setState({data: json})});
  }

  handleDateChange(e) {
    // Change date as specified by calendar
    this.setState({date: e.target.value}, () => {this.handleUpdate();});
  }
  
  handleDayChange(i) {
    // Change date by a single day
    let date = new Date(this.state.date);
    date.setDate(date.getDate() + i);
    this.setState({date: date.toJSON().substring(0,10)}, () => {this.handleUpdate();});
  }

  handleDelete(id) {
    // Delete a record
    fetch('http://localhost:5000/records?id='+id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => {
        if (response.status === 200) {
          console.log('Successfully deleted entry');
          this.handleUpdate();
        }
      });
  }

  render() {
    if (!this.state.loggedIn)
      return <LoginMenu onLogin={() => this.handleLogin()} />;
    else {
      return (
        <div>
          <DateForm date={this.state.date} onDateChange={(e) => this.handleDateChange(e)} onDayChange={this.handleDayChange} />
          <DailyTotals date={this.state.date} />
          <RecordTable data={this.state.data} onDelete={this.handleDelete}/>
          <BottomNav date={this.state.date} onUpdate={this.handleUpdate}/>
        </div>
      );
    }
  }
}

// ========================================================

ReactDOM.render(<App />, document.getElementById('root'));

// ================ Helper functions ===================
function getDate() {
  let date = new Date();
  return date.getFullYear() + '-' + (date.getMonth() + 1 )+ '-' + date.getDate();
}

