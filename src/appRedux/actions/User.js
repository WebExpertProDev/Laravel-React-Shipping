import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    SUBMIT_USER_DETAIL_SUCCESS,
    GET_USER_BOOKS_SUCCESS
  } from "../../constants/ActionTypes";
import axios from 'axios';
import {environment as env} from "../../environments/environments";
import {headerWithToken as options} from "../../environments/environments";
import {message} from "antd";
import * as exp from "../../constants/expressions";
import {history} from "../store";
import {getUser} from "./Auth";

export const postUserDetails = ({payload, token}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        console.log("payload: ", payload);
        console.log("token: ", token);
        const url = `${env.backendBaseUrl}/api/u/store`;

        axios.post(url, payload, 
            options(token)
          ).then(({data}) => {
            console.log("Services: ", data);
            if (data.user_detail) {
                dispatch({type: SUBMIT_USER_DETAIL_SUCCESS, payload: data.user_detail});
                message.success(exp.SUBMIT_SUCCESS);
                dispatch({type: FETCH_SUCCESS});
                return dispatch(getUser());
            } else {
                dispatch({type: FETCH_ERROR, payload: data.error});
            }
          }).catch(function (error) {
            dispatch({type: FETCH_ERROR, payload: error.message});
            console.log("Error****:", error.message);
          });     
       }
}

export const getUserBooks = ({payload, token}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        console.log("payload: ", payload);
        console.log("token: ", token);
        if (!!payload.uuid){
            const url = `${env.backendBaseUrl}/api/u/books/${payload.uuid}`;

            axios.get(url,
                options(token)
              ).then(({data}) => {
                console.log("Services: ", data);
                if (data.books) {
                    dispatch({type: GET_USER_BOOKS_SUCCESS, payload: data.books});
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
}