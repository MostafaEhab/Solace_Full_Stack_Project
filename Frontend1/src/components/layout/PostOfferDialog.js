import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ChipInput from 'material-ui-chip-input';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createOffer } from '../../actions/offer';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  dialogRow: {
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
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chipPaper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  buttonStyle1: {
    background: '#1d9419',
    color: '#fff',
  },
}));

const PostOfferDialog = ({ handleClose, createOffer, history }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [city, setCity] = useState('');
  const [currency, setCurrency] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tags, setTags] = useState();
  const { title, description, price } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleCity = (event) => {
    setCity(event.target.value);
  };
  const handleTags = (tags) => {
    setTags(tags);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createOffer({
      title,
      description,
      price,
      currency,
      city,
      startDate,
      endDate,
      tags,
      history,
    });
    handleClose();
  };

  return (
    <Box
      className={classes.boxStyle}
      elevation={10}
      variant='outlined'
      p={1}
      mt={2}
      ml={2}
      mr={2}
    >
      {' '}
      <DialogTitle id='form-dialog-title'>Post a new offer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can post a new offer and find an executor so easily. Just fill in
          the fields to post a new offer...
        </DialogContentText>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className={classes.dialogRow}>
            <TextField
              autoFocus
              name='title'
              value={title}
              onChange={(e) => onChange(e)}
              label='Title'
              fullWidth
              required
            />
          </div>
          <div className={classes.dialogRow}>
            <TextField
              name='description'
              value={description}
              onChange={(e) => onChange(e)}
              label={'Description'}
              multiline
              rows={5}
              fullWidth
              required
            />
          </div>
          <div className={classes.dialogRow}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id='city-label'>City</InputLabel>
              <Select
                labelId='city-label'
                id='city-select'
                value={city}
                onChange={handleCity}
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
          </div>
          <div className={classes.dialogRow}>
            <TextField
              name='price'
              value={price}
              onChange={(e) => onChange(e)}
              label='Price'
              type='number'
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <FormControl className={classes.formControl}>
              <InputLabel id='currency-label'>Currency</InputLabel>
              <Select
                labelId='currency-label'
                id='currency-select'
                value={currency}
                onChange={handleCurrency}
                required
              >
                <MenuItem value='EUR'>EUR</MenuItem>
                <MenuItem value='USD'>USD</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.dialogRow}>
            <ChipInput
              label='Tags'
              onChange={(tags) => handleTags(tags)}
              fullWidth
            />
          </div>
          <div className={classes.dialogRow}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                fullWidth
                format='yyyy/MM/dd'
                label='Start Date'
                name='startDate'
                value={startDate}
                onChange={setStartDate}
                minDate={new Date()}
                required
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                fullWidth
                format='yyyy/MM/dd'
                label='End Date'
                name='endDate'
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
                required
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <br></br>
          <Button type='submit' className={classes.buttonStyle1} fullWidth>
            Post
          </Button>
        </form>
      </DialogContent>
    </Box>
  );
};

PostOfferDialog.propTypes = {
  createOffer: PropTypes.func.isRequired,
};

export default connect(null, { createOffer })(withRouter(PostOfferDialog));
