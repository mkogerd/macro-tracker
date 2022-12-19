import React from 'react';
import { Drawer, TextField, List, ListItem, ListItemText, Dialog, InputAdornment } from '@material-ui/core';

export default class FoodSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foodSearch: '',
      results: [],
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    // Query database for specified food
    fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/foods?food=`+this.state.foodSearch)
      .then(response => response.json())
      .then(json => {
        if (json.errors) {
          this.props.onError(json);
        }
        else this.setState({results: json});
      });
  }

  render() {
    const searchResults = this.state.results.map((entry) =>
      <SearchResult onUpdate={this.props.onUpdate} date={this.props.date} key={entry.id} onError={this.props.onError} {...entry}/>
    );

    return (
      <div>
        
        <Drawer anchor="right" open={this.props.open} onClose={this.props.onClose}>

          <form onSubmit={this.onSubmit}>
            <TextField
              style={{margin: 0}}
              variant="filled"
              label="Enter a food to search"
              value={this.state.foodSearch}
              onChange={this.handleChange('foodSearch')}
              type="search"
              fullWidth
              margin="normal"
            />
          </form>

          <List style={{overflow: 'scroll'}}>
            {searchResults}
          </List>

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
      open: false,
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    // Send new record data to API to update user record
    fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/records`, {
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
        if (json.errors) {
          this.props.onError(json);
        }
        else {
          this.handleClose();
          this.props.onUpdate();
        }
      });
  }

  handleChange = prop => event => {
    let val = event.target.value;
    let regex = /^([0-9]?)+(\.[0-9]?[0-9]?)?$/;
    if (regex.test(val))
      this.setState({ [prop]: val });

  };

  handleClose = () => {
    this.setState({ amount: '', open: false });
  }

  render () {
    return (
      <div>
        <ListItem button divider selected={this.state.open} onClick={() => this.setState({ open: true })} >
          <ListItemText primary={this.props.name + ' - ' + this.props.serving_grams + 'g'} 
            secondary={'F:' + this.props.fat + 'g C:'+ this.props.carb + 'g P:'+ this.props.protein + 'g'} />
        </ListItem>

        <Dialog open={this.state.open} onClose={this.handleClose} >
          <form style={{ padding: 30 }} onSubmit={this.onSubmit} >
            <TextField
              label="Enter amount"
              type="number"
              value={this.state.amount}
              inputProps={{step: 0.01}}
              onChange={this.handleChange('amount')}
              fullWidth
              margin="normal"
              InputProps={{ endAdornment: (<InputAdornment position="end">(g)</InputAdornment>) }}
            />
          </form>
        </Dialog>
      </div>
    );
  }
}