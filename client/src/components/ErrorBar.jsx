import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export default class ErrorBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) // Prevent opening when no error present
      this.setState({ open: true });
  }

  handleClose() {
    this.setState({open: false});
    this.props.onError({errors: [{msg: ''}]});
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => this.handleClose()}
        open={this.state.open}
        autoHideDuration={4000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.props.message}</span>}
      />

    );
  }
}