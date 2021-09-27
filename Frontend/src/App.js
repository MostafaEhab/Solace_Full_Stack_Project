import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Alert from './components/layout/Alert';
import Offers from './components/dashboard/Offers';
import OfferDetails from './components/layout/OfferDetails';
import UserProfile from './components/layout/UserProfile';
import MyProfile from './components/layout/MyProfile';
import Review from './components/layout/Review';
import PrivateRoute from './components/routing/PrivateRoute';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import './App.css';
import './css/MyProfile.css'
import './css/UserProfile.css'
import './css/Offers.css'


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <CssBaseline />
        <Navbar></Navbar>
        <Route exact path='/' component={Landing}></Route>
        <Box>
          <Alert></Alert>
          <Switch>
            <Route exact path='/signup' component={SignUp}></Route>
            <Route exact path='/login' component={Login}></Route>
            <PrivateRoute exact path='/users/:id' component={UserProfile}></PrivateRoute>
            <PrivateRoute exact path='/myprofile' component={MyProfile}></PrivateRoute>
            <PrivateRoute
              exact
              path='/offers'
              component={Offers}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path='/offers/:id'
              component={OfferDetails}
            ></PrivateRoute>
            <PrivateRoute
              exact
              path='/reviews/offer/:id'
              component={Review}
            ></PrivateRoute>
          </Switch>
        </Box>
      </Router>
    </Provider>
  );
};

export default App;
