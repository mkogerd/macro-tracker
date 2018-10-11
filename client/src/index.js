import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
 
  onSubmit = (e) => {
    e.preventDefault();

    // Send registration form state to API
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(json => console.log(json));
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
	<h3>Register</h3>
        <label htmlFor="username">Enter username</label>
        <input name="username" type="text" 
          value={this.state.username} onChange={this.onChange} />

        <label htmlFor="password">Enter password</label>
        <input name="password" type="password" 
          value={this.state.password} onChange={this.onChange} />

        <button>Send data!</button>
      </form>
    );
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
 
  onSubmit = (e) => {
    e.preventDefault();

    // Send registration form state to API
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
	if (json.token) {
           localStorage.token = json.token;
           this.props.onLogin();
        }
      });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
	<h3>Login</h3>
        <label htmlFor="username">Enter username</label>
        <input name="username" type="text" 
          value={this.state.username} onChange={this.onChange} />

        <label htmlFor="password">Enter password</label>
        <input name="password" type="password" 
          value={this.state.password} onChange={this.onChange} />

        <button>Send data!</button>
      </form>
    );
  }
}

class EntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      food: '',
      weight: '',
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    // Send registration form state to API
    fetch('http://localhost:5000/post', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
	'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({date: this.props.date, ...this.state})
    })
      .then(response => {
        if (response.status === 200) // Post successful
          this.props.onUpdate();
      });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label htmlFor="food">Enter food</label>
        <input name="food" type="text" 
          value={this.state.username} onChange={this.onChange} />

        <label htmlFor="weight">Enter weight</label>
        <input name="weight" type="weight" 
          value={this.state.password} onChange={this.onChange} />

        <button>Send data!</button>
      </form>
    )
  }
}

class DateForm extends React.Component {
  render() {
    return (
      <form>
        <input type="date" name="bday" value={this.props.date} onChange={this.props.onDateChange} />
      </form>
    )
  }
}

function MealEntry(props) {
  return (
    <tr>
      <td>{props.food}</td>
      <td>{props.volume}</td>
      <td>{props.weight}</td>
    </tr>
  );
}

function MealTable(props) {
  // Load meal entries collected from database
  const mealEntries = props.data.map((entry, index) =>
    <MealEntry key={index} {...entry}/>
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Meals</th>
          <th>Volume</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {mealEntries}
      </tbody>
    </table>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      date: new Date().toJSON().substring(0,10),
      loggedIn: false,
     };
  }

  handleLogin() {
    this.setState({loggedIn: true});
    this.handleUpdate();
  }

  handleUpdate() {
    fetch('http://localhost:5000/meals?date='+this.state.date, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
	'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => response.json())
      .then(json => this.setState({data: json}));
  }

  handleDateChange(e) {
    this.setState({date: e.target.value}, () => {this.handleUpdate();});
  }

  render() {
    if (!this.state.loggedIn) {
      return (
        <div>
          <RegisterForm />
          <LoginForm onLogin={() => this.handleLogin()} />
        </div>
      );
    } else {
      return (
        <div>
          <DateForm date={this.state.date} onDateChange={(e) => this.handleDateChange(e)} />
          <MealTable data={this.state.data} />
          <EntryForm date={this.state.date} onUpdate={() => this.handleUpdate()}/>
        </div>
      );
    }
  }

}

// =============================

ReactDOM.render(<App />, document.getElementById('root'));
