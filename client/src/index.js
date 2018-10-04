import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
      <MealTable data={this.state.data}/>
    );
  }
}

// =============================

ReactDOM.render(<App />, document.getElementById('root'));
