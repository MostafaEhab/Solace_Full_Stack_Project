import axios from 'axios';
import { setAlert } from './alert';
import { POST_REVIEW, REVIEW_ERROR } from './types';

export const createReview =
  ({ offerId, description, rating, tags, history }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if(tags)
      tags= tags.toString();
    const body = JSON.stringify({
      offerId,
      description,
      rating,
      tags,
    });
    console.log(body);
    try {
      const res = await axios.post('/api/reviews', body, config);
      dispatch({
        type: POST_REVIEW,
        payload: res.data,
      });
      dispatch(setAlert('Created a new review!'));
      history.push('/offers/'+ offerId);

    } catch (err) {
      dispatch({
        type: REVIEW_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
      dispatch(setAlert('Something went wrong'));
    }
  };
