import { POST_OFFER, OFFER_ERROR } from '../actions/types';

const initialState = {
  offer: null,
  offers: [],
  loading: true,
  error: {},
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case POST_OFFER:
      return {
        ...state,
        offer: payload,
        loading: false,
      };
    case OFFER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        offer: null,
      };
    default:
      return state;
  }
}

export default profileReducer;
