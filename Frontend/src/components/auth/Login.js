import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Box, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const useStyles = makeStyles((theme) => ({
  loginRow: {
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
    height: '70vh',
  },
  buttonStyle: {
    background: '#1d9419',
    color: '#fff',
  },
}));

const Login = ({ login, isAuthenticated }) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
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
          <h1 className='large text-primary'>Login</h1>
          <p className='lead'>
            Login to your account and start using our services!
          </p>
          <br></br>
        </Grid>
        <form className={classes.root} onSubmit={(e) => onSubmit(e)}>
          <div className={classes.loginRow}>
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
          </div>
          <div className={classes.loginRow}>
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
          <div className={classes.loginRow}>
            <Button
              className={classes.buttonStyle}
              variant='contained'
              type='submit'
              fullWidth
            >
              Login
            </Button>
          </div>
        </form>
        <p className='my-1'>
          Don't have an account? <Link to='/signup'>Sign Up</Link>
        </p>
      </Box>
    </Grid>
  );
};

Login.prototypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
