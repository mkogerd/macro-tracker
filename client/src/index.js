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
        <label htmlFor="username">Enter username</label>
        <input id="username" name="username" type="text" 
          value={this.state.username} onChange={this.onChange} />

        <label htmlFor="email">Enter password</label>
        <input id="password" name="password" type="password" 
          value={this.state.password} onChange={this.onChange} />

        <button>Send data!</button>
      </form>
    );
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
    this.state = {data: []};

    // Load meal entries from database
    fetch('http://localhost:5000/meals')
      .then(response => response.json())
      .then(json => this.setState({ data: json }));
  }

  render() {
    return (
      <div>
        <RegisterForm />
        <MealTable data={this.state.data} />
      </div>
    );
  }
}

// =============================

ReactDOM.render(<App />, document.getElementById('root'));
