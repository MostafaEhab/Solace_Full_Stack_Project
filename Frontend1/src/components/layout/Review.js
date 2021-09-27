import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import { Box, Grid, TextField, Button, Typography } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import { withRouter, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { createReview } from '../../actions/review.js';
import PropTypes from 'prop-types';

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

const useStyles = makeStyles((theme) => ({
  heading: {
    marginTop: '32px',
  },
  rating: {
    width: 200,
    display: 'flex',
    marginBottom: '2em',
  },
  textfield: {
    borderRadius: 5,
    width: 400,
    padding: 10,
    marginBottom: '2em',
  },
  buttonStyle: {
    background: '#1d9419',
    color: '#fff',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));  

const Review = ({createReview, history}) => {
  const classes = useStyles();

  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [tags, setTags] = React.useState();
  const [description, setFormData] = React.useState();

  const handleTags = (tags) => {
    setTags(tags);
  };

  const offerId= useParams()['id'];

  const onSubmit = (e) => {
    e.preventDefault();
    createReview({
      offerId,
      description,
      rating,
      tags,
      history,
    });
  };

  const onChange = (e) => {
    setFormData(e.target.value);
  };
    
  return (
    <Grid
      container
      alignItems='center'
      direction='column'
      style={{ minHeight: '100vh' }}
      spacing={5}
    >
      <Grid item>
        <Typography className={classes.heading} variant='h5' color='primary'>
          Give feedback and stars!
        </Typography>
      </Grid>
      <Grid item style={{ border: '0.2px solid gray' }}>
        <Grid container direction='column' alignItems='center' justify='center'>
        <div className={classes.rating}>
          <Rating
            name='review-star'
            rating={rating}
            precision={0.5}
            onChange={(event, newRating) => {
              setRating(newRating);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
          />
          {rating !== null && (
            <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </div>
        <TextField
          className={classes.textfield}
          id='review-text'
          onChange={(e) => onChange(e)}
          label='Enter your feedback...'
          variant='outlined'
          multiline
          rows={4}
        />
        <p>If applicable you can add tags: POLITE / ON_TIME / RESPONSIBLE <br/> and press enter after each tag.</p>
        <ChipInput label='Tags' onChange={(tags) => handleTags(tags)} />
        <br></br>
        <Button size='large' variant='contained' className={classes.buttonStyle} onClick={onSubmit}>
          SUBMIT
        </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};


Review.propTypes = {
  createReview: PropTypes.func.isRequired,
};

export default connect(null, { createReview })(withRouter(Review));

