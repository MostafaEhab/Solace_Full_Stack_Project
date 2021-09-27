import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import PostOfferDialog from './PostOfferDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    background: '#2f3031',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    flexGrow: 1,
    padding: 5,
    color: '#fff',
  },
  buttonStyle1: {
    background: '#1d9419',
    color: '#fff',
  },
  buttonStyle2: {
    background: '#fde2e2',
    color: '#000',
  },
}));

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const authLinks = (
    <div> 
       <Button component={Link} to='/myprofile' variant='inline' color='inherit'>
        Profile
      </Button>
      <Button component={Link} to='/offers' variant='inline' color='inherit'>
        Dashboard
      </Button>
      <Button variant='text' color='inherit' onClick={handleClickOpen}>
        Post Offer
      </Button>
      <Button onClick={logout} className={classes.buttonStyle1}>
        Logout
      </Button>
      <Dialog open={open} aria-labelledby='form-dialog-title'>
        <PostOfferDialog handleClose={handleClose}></PostOfferDialog>
        <DialogActions>
          <Button
            onClick={handleClose}
            className={classes.buttonStyle2}
            fullWidth
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  const guestLinks = (
    <div>
      <Button component={Link} to='/signup' variant='inline' color='inherit'>
        Sign Up
      </Button>
      <Button component={Link} to='/login' variant='inline' color='inherit'>
        Login
      </Button>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position='static'>
        <Toolbar>
          <AcUnitIcon className={classes.icon}></AcUnitIcon>
          <Typography
            component={Link}
            to='/'
            variant='h4'
            className={classes.title}
          >
            Solace
          </Typography>
          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
