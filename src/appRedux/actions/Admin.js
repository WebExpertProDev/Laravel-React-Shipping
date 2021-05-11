import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    GET_USERS_SUCCESS,
    DELETE_USER_SUCCESS,
    GET_ADMIN_BOOKS_SUCCESS
  } from "../../constants/ActionTypes";
import axios from 'axios';
import {environment as env} from "../../environments/environments";
import {headerWithToken as options} from "../../environments/environments";
import {message} from "antd";
import * as exp from "../../constants/expressions";


export const getUsers = ({token}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        
        //console.log(token);
        const url = `${env.backendBaseUrl}/api/users`;

        axios.get(url, 
            options(token)
          ).then(({data}) => {
            console.log("Users: ", data);
            if (data.data) {
                dispatch({type: GET_USERS_SUCCESS, payload: data.data});
                dispatch({type: FETCH_SUCCESS});
            } else {
              dispatch({type: FETCH_ERROR, payload: data.error});
            }
          }).catch(function (error) {
            dispatch({type: FETCH_ERROR, payload: error.message});
            console.log("Error****:", error.message);
        });

        
    }
}

export const deleteUser = ({payload, token}) => {
  return (dispatch) => {
      dispatch({type: FETCH_START});
      
      console.log(token);
      const url = `${env.backendBaseUrl}/api/users/${payload.id}`;
      console.log(url);

      axios.delete(url, 
          options(token)
        ).then(({data}) => {
          console.log("Delete User: ", data);

          dispatch({type: DELETE_USER_SUCCESS, payload});
          // if (data.data) {
          //     dispatch({type: GET_USERS_SUCCESS, payload: data.data});
          //     dispatch({type: FETCH_SUCCESS});
          // } else {
          //   dispatch({type: FETCH_ERROR, payload: data.error});
          // }
        }).catch(function (error) {
          dispatch({type: FETCH_ERROR, payload: error.message});
          console.log("Error****:", error.message);
      });

      
  }
}

export const getBooks = ({token}) => {
  return (dispatch) => {
      dispatch({type: FETCH_START});
      
      //console.log(token);
      const url = `${env.backendBaseUrl}/api/admin/books`;

      axios.get(url, 
          options(token)
        ).then(({data}) => {
          console.log("Books: ", data);
          if (data.books) {
              dispatch({type: GET_ADMIN_BOOKS_SUCCESS, payload: data.books});
              dispatch({type: FETCH_SUCCESS});
          } else {
            dispatch({type: FETCH_ERROR, payload: data.error});
          }
        }).catch(function (error) {
          dispatch({type: FETCH_ERROR, payload: error.message});
          console.log("Error****:", error.message);
      });    
  }
}