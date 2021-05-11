import {
    GET_TRACKING_INFO_SUCCESS,
    GET_TRACKING_INFO_SUCCESS_WITH_NULL
} from '../../constants/ActionTypes'

const INIT_STATE = {
    error: null,
    shipments: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRACKING_INFO_SUCCESS : {
        return {
            ...state,
            shipments : action.payload
        }
    }
    case GET_TRACKING_INFO_SUCCESS_WITH_NULL : {
        return {
            ...state,
            error: action.payload
        }
    }

    default:
      return state;
  }
}
