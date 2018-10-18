import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import { NewFoodForm, LoginMenu, RecordTable } from './components';
import LoginMenu from './components/LoginMenu';
import RecordTable from './components/RecordTable';
import DateForm from './components/DateForm';
import DailyTotals from './components/DailyTotals';
import BottomNav from './components/BottomNav';

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    // Send new record data to API to update user record
    fetch('http://localhost:5000/records', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({date: this.props.date, foodID: this.props.id, weight: this.state.amount})
    })
      .then(response => response.json())
      .then(json => {
        if (json.errors)
          console.log(json.errors);
        else this.props.onUpdate();
      });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  render () {
    return (
      <div className="search-result"> 
        <span style={{gridArea: 'name'}}>{this.props.name}</span>
        <span style={{gridArea: 'size'}}>Serving: {this.props.serving_grams}g</span>
        <span style={{gridArea: 'carb'}}>C:{this.props.carb}g</span>
        <span style={{gridArea: 'pro'}}>P:{this.props.protein}g</span>
        <span style={{gridArea: 'fat'}}>F:{this.props.fat}g</span>
        <form style={{gridArea: 'input'}} onSubmit={this.onSubmit}>
          <input type="number" name="amount" onChange={this.onChange} placeholder="Enter weight" step="0.01"></input>
        </form>
      </div>
    );
  }
}

class FoodSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodSearch: '',
      results: [],
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    // Query database for specified food
    fetch('http://localhost:5000/foods?food='+this.state.foodSearch)
      .then(response => response.json())
      .then(json => {
        if (json.errors)
          console.log(json);
        else this.setState({results: json});
      });
  }

  render() {
    const searchResults = this.state.results.map((entry) =>
      <SearchResult onClick={this.handleClick} onUpdate={this.props.onUpdate} date={this.props.date} key={entry.id} {...entry}/>
    );

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input name="foodSearch" type="search" placeholder="Enter a food to search"
            value={this.state.foodSearch} onChange={this.onChange} />
        </form>
        {searchResults}
      </div>
    );
  }
}



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
          <FoodSearch date={this.state.date} onUpdate={() => this.handleUpdate()} />
          <BottomNav />
        </div>
      );
    }
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
}

// ========================================================

ReactDOM.render(<App />, document.getElementById('root'));

// ================ Helper functions ===================
function getDate() {
  let date = new Date();
  return date.getFullYear() + '-' + (date.getMonth() + 1 )+ '-' + date.getDate();
}

