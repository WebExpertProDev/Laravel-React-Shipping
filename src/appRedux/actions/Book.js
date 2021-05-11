import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    BOOK_STEP_NEXT,
    BOOK_STEP_PREV,
    GET_SERVICE_SUCCESS,
    GET_SPECIFIC_SERVICE_SUCCESS,
    POST_BOOK_SHIPMENT_SUCCESS,
    SAVE_SHIPMENT_DATA
  } from "../../constants/ActionTypes";
import axios from 'axios';
import {environment as env} from "../../environments/environments";
import {headerWithToken as options} from "../../environments/environments";
import {NotificationManager} from "react-notifications";
import IntlMessages from "util/IntlMessages";
import {message} from "antd";
import * as exp from "../../constants/expressions";


export const firstStepSubmit = ({payload}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        
        payload.shipmentType = parseInt(payload.shipmentType);
        console.log(payload);
        //console.log(options(payload.token));

        // save shipment data for final submit.
        dispatch({type: SAVE_SHIPMENT_DATA, payload});

        const url = `${env.backendBaseUrl}/api/books/service`;
        axios.post(url, payload, 
            options(payload.token)
          ).then(({data}) => {
            console.log("Services: ", data);
            if (data) {
                //console.log(typeof(data));
                const entries = Object.entries(data);
                console.log(entries);
                dispatch({type: FETCH_SUCCESS});
                dispatch({type: GET_SERVICE_SUCCESS, payload: entries});
                dispatch({type: BOOK_STEP_NEXT});      
            } else {
              //dispatch({type: FETCH_ERROR, payload: data.error});
              dispatch({type: FETCH_ERROR, payload: exp.INVALID_POSTAL_CODE});
            }
          }).catch(function (error) {
            //dispatch({type: FETCH_ERROR, payload: error.message});
            console.log("Error****:", error.message);
            // dispatch({type: FETCH_ERROR, payload: exp.INVALID_POSTAL_CODE});

            if (!!error.response){
                if (!!error.response.status) {
                  let statusCode = error.response.status;
                  //onsole.log("Error status:", error.response.status);
                  if(statusCode >= 400 && statusCode < 500){
                      if (statusCode == 401){
                        dispatch({type: FETCH_ERROR, payload: exp.AUTHENTICATION_ERROR});
                      } else {
                        dispatch({type: FETCH_ERROR, payload: exp.INVALID_POSTAL_CODE});
                      }
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
}

export const goToPrevStep = () => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        dispatch({type: BOOK_STEP_PREV});
        dispatch({type: FETCH_SUCCESS});
        // message.success(exp.SUIGNUP_SUCCESS);   
       }
}

export const secondStepSubmit = ({payload}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        
        //console.log(payload);
        //console.log(options(payload.token));

        dispatch({type: FETCH_SUCCESS});
        dispatch({type: GET_SPECIFIC_SERVICE_SUCCESS, payload});
        dispatch({type: BOOK_STEP_NEXT});

       }
}


export const postBookShipment = ({payload, token}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        
        console.log(payload);
        console.log(JSON.stringify(payload));
        //console.log(options(token));
        const url = `${env.backendBaseUrl}/api/books/shipment`;

        axios.post(url, payload, 
            options(token)
        ).then(({data}) => {
            console.log("Services: ", data);
            if (data) {
                dispatch({type: FETCH_SUCCESS});
                dispatch({type: POST_BOOK_SHIPMENT_SUCCESS})
                message.success(exp.SUIGNUP_SUCCESS);
                //message.success(data.orderId + ", " + data.pickupTime);     
            } else {
                dispatch({type: FETCH_ERROR, payload: data.error});
            }
        }).catch(function (error) {
            //dispatch({type: FETCH_ERROR, payload: error.message});
            console.log("Error****:", error.message);

            if (!!error.response){
                if (!!error.response.status) {
                  let statusCode = error.response.status;
                  //onsole.log("Error status:", error.response.status);
                  if(statusCode >= 400 && statusCode < 500){
                      if (statusCode == 401){
                        dispatch({type: FETCH_ERROR, payload: exp.AUTHENTICATION_ERROR});
                      } else {
                        dispatch({type: FETCH_ERROR, payload: exp.SERVER_ERROR});
                      }
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
}
