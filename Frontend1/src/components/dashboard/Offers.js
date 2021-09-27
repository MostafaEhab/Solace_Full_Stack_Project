import classes from '../../css/Offers.module.css';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import ChipInput from 'material-ui-chip-input';
import InputBase from '@material-ui/core/InputBase';
import RefreshIcon from '@material-ui/icons/Refresh';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sorting: 'creationAsc',
      startDate: null,
      endDate: null,
    };
    this.state.city = '';
    this.state.titleSearch = '';
    this.state.offers = [];
    this.state.tags = [];
    this.state.shownStates = [];
    this.state.toggle = false;
    this.state.noOffer = false;
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleCity = this.handleCity.bind(this);
    this.handletags = this.handleTags.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  async componentDidMount() {
    const body = { sortBy: this.state.sorting };
    let res = null;
    try {
      res = await axios.get('/api/offers/', { params: body });
      this.state.offers = res.data;
    } catch (err) {
      console.error('Error response:');
      console.error(err.response.data); // ***
      console.error(err.response.status); // ***
      if (console.error(err.response.status) === 404) {
        this.state.offers = [];
      }
      this.state.noOffer = true;
    }
    await this.sleep(200);
    this.setState({ isLoading: false, offers: this.state.offers, noOffer: this.state.noOffer });
  }

  async componentDidUpdate(previousProps, previousState) {
    const tags = this.state.tags.join();
    const body = { sortBy: this.state.sorting, tags: tags };
    if (this.state.startDate) {
      body.startDate = this.state.startDate
        .toISOString()
        .toString()
        .substr(0, 10);
    }
    if (this.state.endDate) {
      body.endDate = this.state.endDate.toISOString().toString().substr(0, 10);
    }
    if (this.state.shownStates.length < 5) {
      body.state = this.state.shownStates.join();
    }
    if (this.state.city) {
      body.city = this.state.city;
    }
    if (this.state.titleSearch !== '') {
      body.title = this.state.titleSearch;
    }
    let res = null;
    if (
      JSON.stringify(previousState.offers) !== JSON.stringify(this.state.offers)
    ) {
      return;
    }
    try {
      res = await axios.get('/api/offers/', { params: body });
    } catch (err) {
      console.error(err.response.status); // ***
    }
    let myoffers;
    if (res) {
      myoffers = res.data;
      this.state.noOffer = false;
    } else {
      myoffers = [];
    }
    if (JSON.stringify(previousState) !== JSON.stringify(this.state)) {
      await this.sleep(200);
      this.setState({ offers: myoffers, noOffer: this.state.noOffer });
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatDate(date) {
    date = new Date(date);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
  }

  handleSelectChange(event) {
    this.setState({ sorting: event.target.value });
  }

  handleCity(event) {
    this.setState({ city: event.target.value });
  }
  handleStartDateChange(event) {
    this.setState({ startDate: event });
  }

  handleEndDateChange(event) {
    this.setState({ endDate: event });
  }

  handleRefresh(event) {
    const toggle = this.state.toggle;
    this.setState({ toggle: !toggle });
  }

  handleStateChange(event) {
    this.setState({ shownStates: event.target.value });
  }

  handleTags(event) {
    this.setState({ tags: event });
  }

  handleSearch(event) {
    this.setState({ titleSearch: event.target.value });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div id='loading'>
          <CircularProgress />
        </div>
      );
    } else {
      var indents = [];
      for (var i = 0; i < this.state.offers.length; i++) {
        indents.push(this.anOffer(this.state.offers[i]));
      }

      return (
        <div>
          {/* <h1 id="offerHeader">
            Find an offer and start earning
          </h1> */}
          <div id='refreshButton'>
            <Button variant='inline' onClick={this.handleRefresh}>
              <RefreshIcon></RefreshIcon>
            </Button>
          </div>
          <div id='filters'>
            <div id='offerFilters1'>
              <div id='offerDate'>
                <span>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      fullWidth
                      disableToolbar
                      format='dd/MM/yyyy'
                      margin='normal'
                      label='Start date: '
                      value={this.state.startDate}
                      onChange={this.handleStartDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      style={{width:"50%",height:"2%"}}

                    />
                  </MuiPickersUtilsProvider>
                </span>
                <span >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      fullWidth
                      disableToolbar
                      format='dd/MM/yyyy'
                      margin='normal'
                      label='End date: '
                      value={this.state.endDate}
                      onChange={this.handleEndDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      style={{width:"50%",height:"2%"}}

                    />
                  </MuiPickersUtilsProvider>
                </span>
              </div>
              <span>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id='city-label'>City</InputLabel>
                  <Select
                    labelId='city-label'
                    id='city-select'
                    value={this.state.city}
                    onChange={this.handleCity}
                    fullWidth
                    required
                  >
                    <MenuItem value='MUNICH'>MUNICH</MenuItem>
                    <MenuItem value='BERLIN'>BERLIN</MenuItem>
                    <MenuItem value='HAMBURG'>HAMBURG</MenuItem>
                    <MenuItem value='FRANKFURT'>FRANKFURT</MenuItem>
                    <MenuItem value='LEIPZIG'>LEIPZIG</MenuItem>
                    <MenuItem value='DRESDEN'>DRESDEN</MenuItem>
                    <MenuItem value='BREMEN'>BREMEN</MenuItem>
                    <MenuItem value='POTSDAM'>POTSDAM</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>
            <div id='offerFilters2'>
              <span>
                <ChipInput
                  className={classes.formControl}
                  label='Tags'
                  onChange={(tags) => this.handleTags(tags)}
                  fullWidth
                />
              </span>

              <span id='offerstate'>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    multiple
                    value={this.state.shownStates}
                    onChange={this.handleStateChange}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    <MenuItem value={'New'}>
                      <Checkbox
                        checked={this.state.shownStates.indexOf('New') > -1}
                      />
                      <ListItemText primary='New' />
                    </MenuItem>
                    <MenuItem value={'Completed'}>
                      <Checkbox
                        checked={
                          this.state.shownStates.indexOf('Completed') > -1
                        }
                      />
                      <ListItemText primary='Completed' />
                    </MenuItem>
                    <MenuItem value={'Paid'}>
                      <Checkbox
                        checked={this.state.shownStates.indexOf('Paid') > -1}
                      />
                      <ListItemText primary='Paid' />
                    </MenuItem>
                    <MenuItem value={'Canceled'}>
                      <Checkbox
                        checked={
                          this.state.shownStates.indexOf('Canceled') > -1
                        }
                      />
                      <ListItemText primary='Canceled' />
                    </MenuItem>
                    <MenuItem value={'Matched'}>
                      <Checkbox
                        checked={this.state.shownStates.indexOf('Matched') > -1}
                      />
                      <ListItemText primary='Matched' />
                    </MenuItem>
                  </Select>
                </FormControl>
              </span>
              <span>
                <FormControl fullWidth id='sortBy'>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    labelId='sorting'
                    value={this.state.sorting}
                    onChange={this.handleSelectChange}
                  >
                    <MenuItem value={'creationAsc'}>
                      Creation time - Old to New
                    </MenuItem>
                    <MenuItem value={'creationDesc'}>
                      Creation time - New to Old
                    </MenuItem>
                    <MenuItem value={'startDateAsc'}>
                      Start date - Old to New
                    </MenuItem>
                    <MenuItem value={'startDateDesc'}>
                      Start date - New to Old
                    </MenuItem>
                    <MenuItem value={'endDateAsc'}>
                      End date - Old to New
                    </MenuItem>
                    <MenuItem value={'endDateDesc'}>
                      End date - New to Old
                    </MenuItem>
                    <MenuItem value={'priceAsc'}>Price - Ascending</MenuItem>
                    <MenuItem value={'priceDesc'}>Price - Descending</MenuItem>
                  </Select>
                </FormControl>
              </span>
            </div>
          </div>
          <div id='searchDiv'>
            <span id='searchBar' className={classes.searchBar}>
              <InputBase
                placeholder='Search an offer...'
                fullWidth
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    this.handleSearch(e);
                  }
                }}
              />
            </span>
          </div>
          {this.state.noOffer && (
            <Box
              fontSize='h3.fontSize'
              fontWeight='fontWeightBold'
              fontFamily='Monospace'
              marginLeft='5%'
            >
              There is no offer in Solace yet.
            </Box>
          )}
          {indents.length > 0 && <List id='list'>{indents}</List>}
          {!this.state.noOffer && indents.length === 0 && (
            <Box
              fontSize='h3.fontSize'
              fontWeight='fontWeightBold'
              fontFamily='Monospace'
              marginLeft='5%'
            >
              There is no available offer with your search.
            </Box>
          )}
        </div>
      );
    }
  }

  goToUser(userId) {
    this.props.history.push('/users/' + userId);
  }

  goToOffer(offerId) {
    this.props.history.push('/offers/' + offerId);
  }

  offersWithFilter(body) {
    this.props.history.push('/offers/', body);
  }
  anOffer(offer) {
    var tagList = offer.tags.map(function (tag) {
      return <Chip id='chip' label={tag} />;
    });
    if(offer.description && offer.description.length>160){
      offer.description= offer.description.substr(0,160)+"...";
    }
    var currency = '';
    var chipState = 'chipState';
    if (offer.currency === 'EUR' || offer.currency === 'EURO') {
      currency = '€';
    } else if (offer.currency === 'USD' || offer.currency === 'DOLLAR') {
      currency = '$';
    }

    if (offer.state === 'NEW') {
      chipState = 'newState';
    } else if (offer.state === 'COMPLETED') {
      chipState = 'completedState';
    } else if (offer.state === 'PAID') {
      chipState = 'paidState';
    } else if (offer.state === 'CANCELED') {
      chipState = 'canceledState';
    } else if (offer.state === 'MATCHED') {
      chipState = 'matchedState';
    }
    return (
      <div style={{cursor: "pointer",}}>
        <Grid container>
          <Grid xs={2}> </Grid>
          <Grid xs={8}>
            <span>
              <ListItem alignItems='flex-start'>
                <ListItemAvatar
                  onClick={() => {
                    this.goToUser(offer.requesterId);
                  }}
                >
                  <Avatar />
                </ListItemAvatar>
                <div id='docs'>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography id='title'>{offer.title}</Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography id='description'>
                          {offer.description}
                        </Typography>
                      </React.Fragment>
                    }
                    onClick={() => {
                      this.goToOffer(offer._id);
                    }}
                  />
                </div>
                <ListItemText
                  id='details'
                  primary={
                    <React.Fragment>
                      <Typography style={{ fontWeight: 'bold', fontSize: '150%' }}>
                        {'Price: '}
                        {currency + offer.price}
                      </Typography>
                      {'City: '}
                      {offer.city.replace('_', ' ')}
                      <br />
                      {'Start date: '}
                      {this.formatDate(offer.startDate)}
                      <br />
                      {'End date: '}
                      {this.formatDate(offer.endDate)}
                      <br />
                    </React.Fragment>
                  }
                  onClick={() => {
                    this.goToOffer(offer._id);
                  }}
                />
                <Chip id={chipState} label={offer.state} variant='outlined' />
              </ListItem>
              {offer.tags.length > 0 && tagList}

              <Divider id='divider' variant='middle' component='li' />
            </span>
          </Grid>
          <Grid xs={2}> </Grid>
        </Grid>
      </div>
    );
  }
}

export default Offers;
