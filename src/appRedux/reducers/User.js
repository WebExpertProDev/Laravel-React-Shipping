import {
    GET_USER_BOOKS_SUCCESS
} from '../../constants/ActionTypes'

const INIT_STATE = {
    books: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USER_BOOKS_SUCCESS : {
        return {
            ...state,
            books : action.payload
        }
    }
    

    default:
      return state;
  }
}
