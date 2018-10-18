import React from 'react';
import { Button, TextField, IconButton, InputAdornment, Tab, Tabs, Paper } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default class LoginMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      open: true,
      errors: [],
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // Attempt to log a user in
  handleLogin = (state) => {
    // Send registration form state to API
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state)
    })
      .then(response => response.json())
      .then(json => {
        if (json.token) {
           localStorage.token = json.token;
           this.props.onLogin();
        } else {
          console.log(json);
        }
      });
  }

  // Attempt to register a new user
  handleRegister = (state) => {
    // Send registration form state to API
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state)
    })
      .then(response => response.json())
      .then(json => console.log(json));
  }

  render() {
	  return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Paper style={{padding: 30, margin: 30, maxWidth: 500}}>
          <Tabs fullWidth={true} value={this.state.value} onChange={this.handleChange}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          {this.state.value === 0 && <UserPassForm btnTxt='Sign In' onSubmit={this.handleLogin} />}
          {this.state.value === 1 && <UserPassForm btnTxt='Register' onSubmit={this.handleRegister} />}
        </Paper>
      </div>
    );
  }
}

class UserPassForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false,
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <form style={{textAlign: 'center'}} onSubmit={this.onSubmit} >
        <TextField
            required
            variant="outlined"
            label="Username"
            value={this.state.username}
            onChange={this.handleChange('username')}
            fullWidth={true}
            margin="normal" 
        />
        <TextField
            required
            variant="outlined"
            type={this.state.showPassword ? 'text' : 'password'}
            label="Password"
            value={this.state.password}
            onChange={this.handleChange('password')}
            margin="normal" 
            fullWidth={true}
            InputProps={{
              fullWidth: false, // This fixes the adornment+fullwidth sizing bug 
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
        />
        <Button variant="contained" color="primary" type="submit">{this.props.btnTxt}</Button>
      </form>
    );
  }
}