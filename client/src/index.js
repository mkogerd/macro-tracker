import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { NewFoodForm, LoginMenu, RecordTable } from './components';
import LoginMenu from './components/LoginMenu';
import RecordTable from './components/RecordTable';
import DateForm from './components/DateForm';
import DailyTotals from './components/DailyTotals';
import BottomNav from './components/BottomNav';
import ErrorBar from './components/ErrorBar';

import Grid from '@material-ui/core/Grid';



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      date: getDate(),
      loggedIn: (localStorage.getItem('token') ? true : false),
      error: '',
     };

     if (this.state.loggedIn) this.handleUpdate();
     this.handleDayChange = this.handleDayChange.bind(this);
     this.handleDelete = this.handleDelete.bind(this);
  }

  handleLogin() {
    this.setState({loggedIn: true});
    this.handleUpdate();
  }

  handleLogout() {
    this.setState({loggedIn: false});
    localStorage.removeItem('token');
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
    let date;
    let regex = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;

    // If  state.date is valid, use state.date. Otherwise just navigate from current date 
    if (regex.test(this.state.date))
      date = new Date(this.state.date);
    else
      date = new Date(getDate());

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

  handleError(json) {
    if (json.errors)
      this.setState({ error: json.errors[0].msg });
  }

  render() {
    if (!this.state.loggedIn)
      return (
        <React.Fragment>
          <LoginMenu onLogin={() => this.handleLogin()} onError={(json) => this.handleError(json)} />
          <ErrorBar message={this.state.error} onError={(json) => this.handleError(json)} />
        </React.Fragment>
        );
    else {
      return (
        <div style={{ paddingBottom: 61 }}>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={12} md={6} >
              <DateForm date={this.state.date} onDateChange={(e) => this.handleDateChange(e)} onDayChange={this.handleDayChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DailyTotals date={this.state.date} />
            </Grid>
          </Grid>

          <RecordTable data={this.state.data} onDelete={this.handleDelete}/>
          <BottomNav date={this.state.date} onUpdate={() => this.handleUpdate()} onLogout={() =>this.handleLogout()} onError={(json) => this.handleError(json)} />
          <ErrorBar message={this.state.error} onError={(json) => this.handleError(json)} />

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

