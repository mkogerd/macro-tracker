import React from 'react';
import { Dialog, TextField, InputAdornment, Button } from '@material-ui/core';

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

  handleClose = () => {
    this.setState({
      name: '',
      protein: '',
      carb: '',
      fat: '',
      serving_grams: '',
    });
    this.props.onClose();
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

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
      .then(json => {
        if (json.errors)
          console.log(json)
        else 
          this.handleClose();
      });
  }

  render() {
    return (
      <Dialog open={this.props.open || false} onClose={this.handleClose}>
        <form style={{textAlign: 'center', padding: 30}} onSubmit={this.onSubmit}>
          <TextField
            label="Food name"
            value={this.state.name}
            onChange={this.handleChange('name')}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Serving size"
            value={this.state.serving_grams}
            onChange={this.handleChange('serving_grams')}
            type="number"
            inputProps={{step: 0.01}}
            fullWidth
            margin="normal"
            InputProps={{ endAdornment: (<InputAdornment position="end">(g)</InputAdornment>) }}
          />
          <TextField
            label="Fat per serving"
            value={this.state.fat}
            onChange={this.handleChange('fat')}
            type="number"
            inputProps={{step: 0.01}}
            fullWidth
            margin="normal"
            InputProps={{ endAdornment: (<InputAdornment position="end">(g)</InputAdornment>) }}
          />
          <TextField
            label="Carbs per serving"
            value={this.state.carb}
            onChange={this.handleChange('carb')}
            type="number"
            inputProps={{step: 0.01}}
            fullWidth
            margin="normal"
            InputProps={{ endAdornment: (<InputAdornment position="end">(g)</InputAdornment>) }}
          />
          <TextField
            label="Protein per serving"
            value={this.state.protein}
            onChange={this.handleChange('protein')}
            type="number"
            inputProps={{step: 0.01}}
            fullWidth
            margin="normal"
            InputProps={{ endAdornment: (<InputAdornment position="end">(g)</InputAdornment>) }}
          />
          <Button style={{float: 'left'}} variant="contained" color="secondary" onClick={this.handleClose}>Cancel</Button>
          <Button style={{float: 'right'}} variant="contained" color="primary" type="submit">Submit</Button>
        </form>
      </Dialog>
    );
  }
}