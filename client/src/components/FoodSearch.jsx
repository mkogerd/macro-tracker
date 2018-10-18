import React from 'react';
import Drawer from '@material-ui/core/Drawer';

export default class FoodSearch extends React.Component {
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
        
        <Drawer anchor="right" open={this.props.open} onClose={this.props.onClose}>
          <form onSubmit={this.onSubmit}>
            <input name="foodSearch" type="search" placeholder="Enter a food to search"
              value={this.state.foodSearch} onChange={this.onChange} />
          </form>
          {searchResults}
        </Drawer>
        
      </div>
    );
  }
}

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