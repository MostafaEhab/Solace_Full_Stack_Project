import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Box, TextField, Button } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { signup } from '../../actions/auth';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  signUpRow: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:last-child': {
      paddingBottom: theme.spacing(0),
    },
    '&:first-child': {
      paddingTop: theme.spacing(0),
    },
  },
  boxStyle: {
    height: 'auto',
  },
  buttonStyle: {
    background: '#1d9419',
    color: '#fff',
  },
}));

const SignUp = ({ setAlert, signup, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
    password2: '',
    paypalEmail: '',
  });

  const [dateOfBirth, setDateOfBirth] = useState(null);
  const {
    firstName,
    lastName,
    phoneNumber,
    address,
    email,
    password,
    password2,
    paypalEmail,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match!', 'danger');
    } else {
      signup({
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
        password2,
        dateOfBirth,
        paypalEmail,
      });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/offers'></Redirect>;
  }

  return (
    <Grid>
      <Box
        className={classes.boxStyle}
        elevation={10}
        variant='outlined'
        p={5}
        ml={25}
        mr={25}
      >
        <Grid align='center'>
          <h1 className='large text-primary'>Sign Up</h1>
          <p className='lead'>Create your account and enjoy being a member!</p>
          <br></br>
        </Grid>
        <form className={classes.root} onSubmit={(e) => onSubmit(e)}>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='First Name'
              placeholder='Enter your first name'
              name='firstName'
              value={firstName}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='LastName'
              placeholder='Enter your last name'
              name='lastName'
              value={lastName}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='Phone'
              placeholder='Enter your phone number'
              name='phoneNumber'
              value={phoneNumber}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='Address'
              placeholder='Enter your address'
              name='address'
              value={address}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                fullWidth
                inputVariant='outlined'
                format='yyyy/MM/dd'
                label='Date of Birth'
                name='dateOfBirth'
                maxDate={new Date()}
                value={dateOfBirth}
                onChange={setDateOfBirth}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                required
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='Email'
              placeholder='Enter your email address'
              type='email'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
            <small className='form-text'></small>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='Password'
              placeholder='Enter your password'
              type='password'
              name='password'
              value={password}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='Confirm Password'
              placeholder='Enter your password again'
              type='password'
              name='password2'
              value={password2}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <TextField
              variant='outlined'
              label='PayPal Email'
              placeholder='Enter your PayPal email'
              name='paypalEmail'
              value={paypalEmail}
              onChange={(e) => onChange(e)}
              fullWidth
              required
            ></TextField>
          </div>
          <div className={classes.signUpRow}>
            <Button
              className={classes.buttonStyle}
              variant='contained'
              type='submit'
              fullWidth
            >
              Sign Up
            </Button>
          </div>
        </form>
        <p className='my-1'>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </Box>
    </Grid>
  );
};

SignUp.propTypes = {
  setAlert: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, signup })(SignUp);
