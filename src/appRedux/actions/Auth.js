import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  INIT_URL,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET,
  SET_ADMIN
} from "../../constants/ActionTypes";
import axios from 'axios';
import {environment as env} from "../../environments/environments";
import {history} from "../store";
import * as exp from "../../constants/expressions";
import {message} from "antd";

const options = {
  headers: {
      'Accept': 'application/vnd.api.v1+json',
      'Content-Type': 'application/json'
  }
};

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const userSignUp = ({email, password, name, password_confirmation}) => {
  //console.log(email, password, name, password_confirmation);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    const url = `${env.backendBaseUrl}/api/signup`;
    axios.post(url, {
        email: email,
        password: password,
        name: name,
        password_confirmation: password_confirmation
      },
      options
    ).then(({data}) => {
      //console.log("data:", data);  
      dispatch({type: FETCH_SUCCESS});
      message.success(exp.SUIGNUP_SUCCESS);
      history.push("/signin");
    }).catch(function (error) {
      if (!!error.response){
        if(!!error.response.data){
          //console.log("Error****:", error.response.data);
          let statusCode = parseInt(error.response.data.status_code);
          //console.log("status code", statusCode);
          if(statusCode >= 400 && statusCode < 500){
            if(!!error.response.data.errors){     
                let errorData = error.response.data.errors;
                //console.log("errorData", errorData);
                Object.keys(errorData).forEach(function(key){
                  //console.log("key:", key);
                  var errorItem = errorData[key];
                  //console.log(errorItem);
                  errorItem.forEach(function(content){
                    dispatch({type: FETCH_ERROR, payload: content});
                    //console.log(content);
                  });
                });
            }
          } else if (statusCode >= 500 && statusCode < 600){
            dispatch({type: FETCH_ERROR, payload: exp.SERVER_ERROR});
          } else {
            dispatch({type: FETCH_ERROR, payload: exp.UNKNOWN_ERROR});
          }   
        } else {
          dispatch({type: FETCH_ERROR, payload: exp.SERVER_ERROR});
        }
      } else {
        dispatch({type: FETCH_ERROR, payload: exp.CONNECTION_ERROR});
      }
    });
  }
};

export const userSignIn = ({email, password}) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    const url = `${env.backendBaseUrl}/oauth/token`;

    axios.post(url, {
      username: email, 
      password: password, 
      grant_type: 'password', 
      client_id: env.oAuthClientID, 
      client_secret: env.oAuthClientSecret}, 
      options
    ).then(({data}) => {
      //console.log("Access Token: ", data);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        //console.log(data.access_token);
        message.success(exp.LOGIN_SUCCESS);
        dispatch({type: FETCH_SUCCESS});
        dispatch({type: USER_TOKEN_SET, payload: data.access_token});
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      //dispatch({type: FETCH_ERROR, payload: error.message});
      //console.log("Error****:", error.message);

      if (!!error.response){
        if (!!error.response.status) {
          let statusCode = error.response.status;
          //onsole.log("Error status:", error.response.status);
          if(statusCode >= 400 && statusCode < 500){   
              dispatch({type: FETCH_ERROR, payload: exp.INVALID_USER_NAME_OR_PASSWORD});
          } else if (statusCode >= 500 && statusCode < 600){
            dispatch({type: FETCH_ERROR, payload: exp.SERVER_ERROR});
          } else {
            dispatch({type: FETCH_ERROR, payload: exp.UNKNOWN_ERROR});
          } 

        } else {
          dispatch({type: FETCH_ERROR, payload: exp.CONNECTION_ERROR});  
        }
      } else {
        dispatch({type: FETCH_ERROR, payload: exp.CONNECTION_ERROR});
      }
    });
  }
};

export const getUser = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    const url = `${env.backendBaseUrl}/api/me`;
    const options = {
      headers: {
          'Content-Type': 'application/vnd.api.v1+json/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}` 
      }
    };
    console.log(`Bearer ${localStorage.getItem("token")}`);
    axios.get(url, options
    ).then(({data}) => {
      console.log("userSignIn: ", data);
      if (data.data) {
        dispatch({type: USER_DATA, payload: data.data});
        //localStorage.removeItem('user');
        localStorage.setItem("user", JSON.stringify(data.data));
        // Check if the user is admin.
        let roles = data.data.roles;
        if (!!roles){
          roles.data.forEach(element => {
            if(element.name == "Owner"){
              localStorage.setItem("isAdmin", true);
              dispatch({type: SET_ADMIN});
            }
          });
        }

        dispatch({type: FETCH_SUCCESS});
      } else {
        dispatch({type: FETCH_ERROR, payload: data.error});
      }
    }).catch(function (error) {
      dispatch({type: FETCH_ERROR, payload: error.message});
      console.log("Error****:", error.message);
    });
  }
};

export const userSignOut = () => {
  return (dispatch) => {
    message.success(exp.LOGOUT_SUCCESS);
    dispatch({type: FETCH_START});
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      localStorage.removeItem("isAdmin");
      dispatch({type: FETCH_SUCCESS});
      dispatch({type: SIGNOUT_USER_SUCCESS});
    }, 2000);
  }
};