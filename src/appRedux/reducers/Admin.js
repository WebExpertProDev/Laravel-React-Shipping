import Item from 'antd/lib/list/Item';
import {
    FETCH_ERROR,
    GET_USERS_SUCCESS,
    DELETE_USER_SUCCESS,
    GET_ADMIN_BOOKS_SUCCESS
} from '../../constants/ActionTypes'

const INIT_STATE = {
    users: [],
    books: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS :{
        return {
            ...state,
            users: action.payload
        }
    }
    case DELETE_USER_SUCCESS: {
        return {
            ...state,
            users: state.users.filter(item => item.id != action.payload.id)
        }
    }
    case GET_ADMIN_BOOKS_SUCCESS: {
        return {
            ...state,
            books: action.payload
        }
    }

    default:
      return state;
  }
}
