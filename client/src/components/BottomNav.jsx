import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AddIcon from '@material-ui/icons/Add';

import NewFoodForm from './NewFoodForm'
import FoodSearch from './FoodSearch';

const styles = {
  root: {
    width: 'auto',
  },
};

class BottomNav extends React.Component {
  state = {
    value: -1,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction label="Logout" icon={<PowerIcon />} />
          <BottomNavigationAction label="New Food" icon={<FastfoodIcon />} />
          <BottomNavigationAction label="Add" icon={<AddIcon />} />
        </BottomNavigation>

        <NewFoodForm open={value === 1} onClose={() => this.setState({value: -1})} />
        <FoodSearch open={value === 2} onClose={() => this.setState({value: -1})}  date={this.props.date} onUpdate={this.props.onUpdate}/>

      </div>
    );
  }
}

BottomNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomNav);