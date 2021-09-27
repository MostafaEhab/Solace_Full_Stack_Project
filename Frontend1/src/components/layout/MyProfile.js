import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import classes from '../../css/OfferDetails.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TextField } from '@material-ui/core';

export class MyProfile extends Component {
  constructor() {
    super();
    this.state = {
      profilePicture:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      requesterRating: 0,
      executerRating: 0,
      description: '',
      rating: 0,
      reqDescription: '',
      exeDescription: '',
      reqRating: 0,
      exeRating: 0,
      reqTag: [],
      exeTag: [],
      reqRevieweerId: '',
      exeRevieweerId: '',
      executerRatingCount: 0,
      requesterRatingCount: 0,
      exeData: [],
      reqData: [],
      isLoading: true,
    };
    this.userId = localStorage.userId;
  }
  async componentDidMount() {
    await axios.get('/api/users/' + this.userId).then((response) => {
      this.setState({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        address: response.data.address,
        requesterRating: response.data.requesterRating,
        executerRating: response.data.executerRating,
        requesterRatingCount: response.data.requesterRatingCount,
        executerRatingCount: response.data.executerRatingCount,
      });
    });
    await axios.get('/api/reviews/user/' + this.userId).then((response) => {
      console.log(response.data.reviewsAsExecuter);
      console.log(response.data.reviewsAsRequester);
      this.setState({
        exeData: response.data.reviewsAsExecuter,
        reqData: response.data.reviewsAsRequester,
      });
    });
    console.log(this.state.requesterRatingCount);

    if (this.state.requesterRatingCount === undefined) {
      console.log('success');
    } else {
      console.log('fail');
    }
    this.reqmapId = {};
    for (let i = 0; i < this.state.requesterRatingCount; i++) {
      this.reqmapId[this.state.reqData[i].reviewerId] = (
        await axios.get('/api/users/' + this.state.reqData[i].reviewerId)
      ).data;
    }
    console.log(this.reqmapId);

    this.exemapId = {};
    for (let i = 0; i < this.state.executerRatingCount; i++) {
      this.exemapId[this.state.exeData[i].reviewerId] = (
        await axios.get('/api/users/' + this.state.exeData[i].reviewerId)
      ).data;
    }
    console.log(this.exemapId);

    this.setState({ isLoading: false });
  }

  imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        this.setState({ profilePicture: reader.result });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    } else if (
      this.state.requesterRatingCount !== undefined && this.state.executerRatingCount !== undefined
    ) {
      return (
        <container>
          <Grid container>
            <Grid xs={5}> </Grid>
            <Grid xs={2} id='BottomNav'>
              <div className='page'>
                <div className='PicContainer'>
                  <h1 className='picheading'>
                    {this.state.firstName} {this.state.lastName}
                  </h1>
                  <div className='img-holder'>
                    <img
                      src={this.state.profilePicture}
                      alt=''
                      id='picimg'
                      className='picimg'
                    />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid xs={5}> </Grid>
            <Grid xs={3}> </Grid>

            <Grid xs={3} id='BottomNav' alignItems='stretch'>
              {' '}
              <Grid alignItems='stretch'>
              <TextField
          id="textEntry"
          label="Email"
          defaultValue={this.state.email}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
        <div id="entrySpace"></div>
        <TextField
          id="textEntry"
          label="Phone Number"
          defaultValue={this.state.phoneNumber}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
        />
         <div id="entrySpace"></div>

              </Grid>
            </Grid>
            <Grid xs={3} alignItems='stretch'>
              {' '}
              <div id='UserRating'>
                {' '}
                <Box component='fieldset' mb={3} borderColor='transparent'>
                  <Typography component='legend'>Executer Rating</Typography>
                  <Rating
                    name='read-only'
                    precision={0.5}
                    value={this.state.executerRating}
                    readOnly
                  />
                </Box>
                <Box component='fieldset' mb={3} borderColor='transparent'>
                  <Typography component='legend'>Requester Rating</Typography>
                  <Rating
                    name='read-only'
                    precision={0.5}
                    value={this.state.requesterRating}
                    readOnly
                  />
                </Box>
                {' '}
              </div>
            </Grid>
            <Grid xs={3}> </Grid>
            <Grid xs={4}> </Grid>

           
            <Grid xs={4} id='BottomNav' alignItems='stretch'>
              <h2 > Past Reviews of {this.state.firstName} {this.state.lastName} as an Executer </h2>

              <div id='div1'>
                {this.state.exeData.map((index) => (
                  <div id='div2'>
                    {' '}
                    <p id='p1'>
                      {this.exemapId[index.reviewerId].firstName +
                        ' ' +
                        this.exemapId[index.reviewerId].lastName}
                    </p>
                    <div id='div3'>
                      {' '}
                      <p id='p2'>{index.description}</p>
                    </div>{' '}
                    <div>
                      {' '}
                      <Box
                        component='fieldset'
                        mb={3}
                        borderColor='transparent'
                      >
                        <Typography component='legend'></Typography>
                        <Rating
                          id='RatingReview'
                          name='read-only'
                          precision={0.5}
                          value={index.rating}
                          readOnly
                        />
                      </Box>{' '}
                    </div>{' '}
                    <div id='tagsPos'>
                      {' '}
                      {index.tags.map((tagIndex) => (
                        <span id='p3'> {tagIndex} </span>
                      ))}{' '}
                    </div>{' '}
                  </div>
                ))}{' '}
              </div>
              <h2> Past Reviews of {this.state.firstName} {this.state.lastName} as a Requester </h2>
              <div id='div1'>
                {this.state.reqData.map((index) => (
                  <div id='div2'>
                    {' '}
                    <p id='p1'>
                      {this.reqmapId[index.reviewerId].firstName +
                        ' ' +
                        this.reqmapId[index.reviewerId].lastName}{' '}
                    </p>
                    <div id='div3'>
                      {' '}
                      <p id='p2'>{index.description}</p>
                    </div>{' '}
                    <div>
                      {' '}
                      <Box
                        component='fieldset'
                        mb={3}
                        borderColor='transparent'
                      >
                        <Typography component='legend'></Typography>
                        <Rating
                          id='RatingReview'
                          name='read-only'
                          precision={0.5}
                          value={index.rating}
                          readOnly
                        />
                      </Box>{' '}
                    </div>{' '}
                    <div id='tagsPos'>
                      {' '}
                      {index.tags.map((tagIndex) => (
                        <span id='p3'> {tagIndex} </span>
                      ))}{' '}
                    </div>{' '}
                  </div>
                ))}{' '}
              </div>
              <div id="pagebottom"></div>
            </Grid>
            <Grid xs={4}></Grid>

          </Grid>
        </container>
      );
    } else if (this.state.executerRatingCount !== undefined) {
      return (
        <container>
        <Grid container>
          <Grid xs={5}> </Grid>
          <Grid xs={2} id='BottomNav'>
            <div className='page'>
              <div className='PicContainer'>
                <h1 className='picheading'>
                  {this.state.firstName} {this.state.lastName}
                </h1>
                <div className='img-holder'>
                  <img
                    src={this.state.profilePicture}
                    alt=''
                    id='picimg'
                    className='picimg'
                  />
                </div>
              </div>
            </div>
          </Grid>
          <Grid xs={5}> </Grid>
          <Grid xs={3}> </Grid>

          <Grid xs={3} id='BottomNav' alignItems='stretch'>
            {' '}
            <Grid alignItems='stretch'>
            <TextField
        id="textEntry"
        label="Email"
        defaultValue={this.state.email}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
      <div id="entrySpace"></div>
      <TextField
        id="textEntry"
        label="Phone Number"
        defaultValue={this.state.phoneNumber}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
       <div id="entrySpace"></div>

            </Grid>
          </Grid>
          <Grid xs={3} alignItems='stretch'>
            {' '}
            <div id='UserRating'>
              {' '}
              <Box component='fieldset' mb={3} borderColor='transparent'>
                <Typography component='legend'>Executer Rating</Typography>
                <Rating
                  name='read-only'
                  precision={0.5}
                  value={this.state.executerRating}
                  readOnly
                />
              </Box>
              <Box component='fieldset' mb={3} borderColor='transparent'>
                <Typography component='legend'>Requester Rating</Typography>
                <Rating
                  name='read-only'
                  precision={0.5}
                  value={this.state.requesterRating}
                  readOnly
                />
              </Box>
              {' '}
            </div>
          </Grid>
          <Grid xs={3}> </Grid>
          <Grid xs={4}> </Grid>

         
          <Grid xs={4} id='BottomNav' alignItems='stretch'>
            <h2 > Past Reviews of {this.state.firstName} {this.state.lastName} as an Executer </h2>

            <div id='div1'>
              {this.state.exeData.map((index) => (
                <div id='div2'>
                  {' '}
                  <p id='p1'>
                    {this.exemapId[index.reviewerId].firstName +
                      ' ' +
                      this.exemapId[index.reviewerId].lastName}
                  </p>
                  <div id='div3'>
                    {' '}
                    <p id='p2'>{index.description}</p>
                  </div>{' '}
                  <div>
                    {' '}
                    <Box
                      component='fieldset'
                      mb={3}
                      borderColor='transparent'
                    >
                      <Typography component='legend'></Typography>
                      <Rating
                        id='RatingReview'
                        name='read-only'
                        precision={0.5}
                        value={index.rating}
                        readOnly
                      />
                    </Box>{' '}
                  </div>{' '}
                  <div id='tagsPos'>
                    {' '}
                    {index.tags.map((tagIndex) => (
                      <span id='p3'> {tagIndex} </span>
                    ))}{' '}
                  </div>{' '}
                </div>
              ))}{' '}
            </div>
            <h2> No Reviews of {this.state.firstName} {this.state.lastName} as a Requester </h2>
            <div id="pagebottom"></div>

          </Grid>

          <Grid xs={4}></Grid>

        </Grid>
      </container>
      );
    }
    else if (this.state.requesterRatingCount !== undefined) {
      return (
        <container>
        <Grid container>
          <Grid xs={5}> </Grid>
          <Grid xs={2} id='BottomNav'>
            <div className='page'>
              <div className='PicContainer'>
                <h1 className='picheading'>
                  {this.state.firstName} {this.state.lastName}
                </h1>
                <div className='img-holder'>
                  <img
                    src={this.state.profilePicture}
                    alt=''
                    id='picimg'
                    className='picimg'
                  />
                </div>
              </div>
            </div>
          </Grid>
          <Grid xs={5}> </Grid>
          <Grid xs={3}> </Grid>

          <Grid xs={3} id='BottomNav' alignItems='stretch'>
            {' '}
            <Grid alignItems='stretch'>
            <TextField
        id="textEntry"
        label="Email"
        defaultValue={this.state.email}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
      <div id="entrySpace"></div>
      <TextField
        id="textEntry"
        label="Phone Number"
        defaultValue={this.state.phoneNumber}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
       <div id="entrySpace"></div>

            </Grid>
          </Grid>
          <Grid xs={3} alignItems='stretch'>
            {' '}
            <div id='UserRating'>
              {' '}
              <Box component='fieldset' mb={3} borderColor='transparent'>
                <Typography component='legend'>Executer Rating</Typography>
                <Rating
                  name='read-only'
                  precision={0.5}
                  value={this.state.executerRating}
                  readOnly
                />
              </Box>
              <Box component='fieldset' mb={3} borderColor='transparent'>
                <Typography component='legend'>Requester Rating</Typography>
                <Rating
                  name='read-only'
                  precision={0.5}
                  value={this.state.requesterRating}
                  readOnly
                />
              </Box>
              {' '}
            </div>
          </Grid>
          <Grid xs={3}> </Grid>
          <Grid xs={4}> </Grid>

          <Grid xs={4} id='BottomNav' alignItems='stretch'>
            <h2 > Past Reviews of {this.state.firstName} {this.state.lastName} as a Requester </h2>

            <div id='div1'>
              {this.state.reqData.map((index) => (
                <div id='div2'>
                  {' '}
                  <p id='p1'>
                    {this.reqmapId[index.reviewerId].firstName +
                      ' ' +
                      this.reqmapId[index.reviewerId].lastName}
                  </p>
                  <div id='div3'>
                    {' '}
                    <p id='p2'>{index.description}</p>
                  </div>{' '}
                  <div>
                    {' '}
                    <Box
                      component='fieldset'
                      mb={3}
                      borderColor='transparent'
                    >
                      <Typography component='legend'></Typography>
                      <Rating
                        id='RatingReview'
                        name='read-only'
                        precision={0.5}
                        value={index.rating}
                        readOnly
                      />
                    </Box>{' '}
                  </div>{' '}
                  <div id='tagsPos'>
                    {' '}
                    {index.tags.map((tagIndex) => (
                      <span id='p3'> {tagIndex} </span>
                    ))}{' '}
                  </div>{' '}
                </div>
              ))}{' '}
            </div>
            <h2> No Reviews of {this.state.firstName} {this.state.lastName} as an Executer </h2>
            <div id="pagebottom"></div>

          </Grid>
          <Grid xs={4}></Grid>

        </Grid>
      </container>
      );
    }
    else {
      return (
        <container>
        <Grid container>
          <Grid xs={5}> </Grid>
          <Grid xs={2} id='BottomNav'>
            <div className='page'>
              <div className='PicContainer'>
                <h1 className='picheading'>
                  {this.state.firstName} {this.state.lastName}
                </h1>
                <div className='img-holder'>
                  <img
                    src={this.state.profilePicture}
                    alt=''
                    id='picimg'
                    className='picimg'
                  />
                </div>
              </div>
            </div>
          </Grid>
          <Grid xs={5}> </Grid>
          <Grid xs={3}> </Grid>

          <Grid xs={3} id='BottomNav' alignItems='stretch'>
            {' '}
            <Grid alignItems='stretch'>
            <TextField
        id="textEntry"
        label="Email"
        defaultValue={this.state.email}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
      <div id="entrySpace"></div>
      <TextField
        id="textEntry"
        label="Phone Number"
        defaultValue={this.state.phoneNumber}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />
       <div id="entrySpace"></div>

            </Grid>
          </Grid>
          <Grid xs={3} alignItems='stretch'>
            {' '}
            <div id='UserRating'>
              {' '}
              <Box component='fieldset' mb={3} borderColor='transparent'>
                <Typography component='legend'>Executer Rating</Typography>
                <Rating
                  name='read-only'
                  precision={0.5}
                  value={this.state.executerRating}
                  readOnly
                />
              </Box>
              <Box component='fieldset' mb={3} borderColor='transparent'>
                <Typography component='legend'>Requester Rating</Typography>
                <Rating
                  name='read-only'
                  precision={0.5}
                  value={this.state.requesterRating}
                  readOnly
                />
              </Box>
              {' '}
            </div>
          </Grid>
          <Grid xs={3}> </Grid>
          <Grid xs={4}> </Grid>

          <Grid xs={4} id='BottomNav' alignItems='stretch'>
           
            <h2 id="Noreviews"> No Reviews of {this.state.firstName} {this.state.lastName} as an Executer </h2>
            <h2> No Reviews of {this.state.firstName} {this.state.lastName} as a Requester </h2>
            <div id="pagebottom"></div>

          </Grid>
          <Grid xs={4}></Grid>

        </Grid>
      </container>
      );
    }
  }
}

export default MyProfile;
