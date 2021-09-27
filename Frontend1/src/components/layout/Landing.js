import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    backgroundImage: `url(${process.env.PUBLIC_URL + '/img/rocks.jpeg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    filter: 'brightness(80%)',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
    },
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

const Landing = ({ isAuthenticated }) => {
  const classes = useStyles();
  if (isAuthenticated) {
    return <Redirect to='/offers'></Redirect>;
  }
  return (
    <div className={classes.root}>
      <Box p={20}>
        <Box
          className={classes.text}
          fontSize='h1.fontSize'
          fontWeight='fontWeightBold'
          fontFamily='Monospace'
        >
          Welcome to Solace
        </Box>
        <Box
          className={classes.text}
          fontSize='h6.fontSize'
          fontStyle='italic'
          fontWeight='fontWeightLight'
        >
          Create or execute a small service to make things done and earn money!
        </Box>
        <Box className={classes.buttons} textAlign='center' m={3}>
          <Button
            className={classes.buttonStyle1}
            component={Link}
            to='/signup'
            variant='contained'
          >
            Sign Up
          </Button>
          <Button component={Link} to='/login' variant='contained'>
            Login
          </Button>
        </Box>
      </Box>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
