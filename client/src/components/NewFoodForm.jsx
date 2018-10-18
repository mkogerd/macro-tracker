import React from 'react';

export default class NewFoodForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      protein: '',
      carb: '',
      fat: '',
      serving_grams: '',
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    // Send new food data to API to add to food listing
    fetch('http://localhost:5000/foods', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(this.state)
    })
      .then(response => response.json())
      .then(json => console.log(json));
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input name="name" type="text" placeholder="Enter food name"
            value={this.state.name} onChange={this.onChange} /> 
        <input name="protein" type="number" placeholder="Enter protein content" step="0.01"
            value={this.state.protein} onChange={this.onChange} />g 
        <input name="carb" type="number" placeholder="Enter carb content" step="0.01"
            value={this.state.carb} onChange={this.onChange} />g 
        <input name="fat" type="number" placeholder="Enter fat content" step="0.01"
            value={this.state.fat} onChange={this.onChange} />g 
        <input name="serving_grams" type="number" placeholder="Enter serving size" step="0.01"
            value={this.state.serving_grams} onChange={this.onChange} />g
        <input type="submit" value="Submit"/>
      </form>
    );
  }
}