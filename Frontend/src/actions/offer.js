import axios from 'axios';
import { setAlert } from './alert';
import { POST_OFFER, OFFER_ERROR } from './types';

export const createOffer =
  ({
    title,
    description,
    price,
    currency,
    city,
    startDate,
    endDate,
    tags,
    history,
  }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      title,
      description,
      price,
      currency,
      city,
      startDate,
      endDate,
      tags,
    });
    try {
      const res = await axios.post('/api/offers', body, config);
      dispatch({
        type: POST_OFFER,
        payload: res.data,
      });
      dispatch(setAlert('Created a new offer!'));
      history.push('/offers');
    } catch (err) {
      dispatch({
        type: OFFER_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
      dispatch(setAlert('Something went wrong'));
    }
  };
