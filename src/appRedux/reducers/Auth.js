import {INIT_URL, SIGNOUT_USER_SUCCESS, USER_DATA, USER_TOKEN_SET, SUBMIT_USER_DETAIL_SUCCESS, SET_ADMIN} from "../../constants/ActionTypes";

const INIT_STATE = {
  token: localStorage.getItem('token'),
  initURL: '',
  authUser: JSON.parse(localStorage.getItem('user')),
  isAdmin: localStorage.getItem('isAdmin')
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {


    case INIT_URL: {
      return {...state, initURL: action.payload};
    }

    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        token: null,
        authUser: null,
        initURL: '',
        isAdmin: false
      }
    }

    case USER_DATA: {
      return {
        ...state,
        authUser: action.payload,
      };
    }

    case USER_TOKEN_SET: {
      return {
        ...state,
        token: action.payload,
      };
    }

    case SUBMIT_USER_DETAIL_SUCCESS: {
      return {
        ...state,
        authUser: {
          ...state.authUser,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          phonenumber: action.payload.phonenumber,
          address: action.payload.address,
          city: action.payload.city,
          countrycode: action.payload.countrycode,
          postalcode: action.payload.postalcode,
          status: action.payload.status
        }
      }
    }

    case SET_ADMIN:{
      return{
        ...state,
        isAdmin: true
      }
    }

    default:
      return state;
  }
}
