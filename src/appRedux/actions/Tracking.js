import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    GET_TRACKING_INFO_SUCCESS,
    GET_TRACKING_INFO_SUCCESS_WITH_NULL
  } from "../../constants/ActionTypes";
import axios from 'axios';
import {environment as env} from "../../environments/environments";
import {headerWithToken as options} from "../../environments/environments";
import {message} from "antd";
import * as exp from "../../constants/expressions";
import {history} from "../store";

export const getTrackingInfo = ({payload, token}) => {
    return (dispatch) => {
        dispatch({type: FETCH_START});
        //console.log(payload);
        //console.log(token);
        const url = `${env.backendBaseUrl}/api/tracking`;

        payload = {
            ...payload,
            locale: "en"
        }

        axios.post(url, payload, 
            options(token)
          ).then(({data}) => {
            //console.log("Services: ", data.TrackingInformationResponse.shipments);
            if (data.TrackingInformationResponse) {
                if(data.TrackingInformationResponse.shipments.length > 0){
                    console.log("length", data.TrackingInformationResponse.shipments.length);
                    dispatch({type: GET_TRACKING_INFO_SUCCESS, payload: data.TrackingInformationResponse.shipments})
                    //message.success(exp.SUBMIT_SUCCESS);
                    dispatch({type: FETCH_SUCCESS});
                    history.push('/info');
                } else {
                    dispatch({type: GET_TRACKING_INFO_SUCCESS_WITH_NULL, payload: exp.WRONG_ORDERID});
                    dispatch({type: FETCH_SUCCESS});
                    history.push('/tracking');
                }  
            } else {
              dispatch({type: FETCH_ERROR, payload: data.error});
            }
          }).catch(function (error) {
            dispatch({type: FETCH_ERROR, payload: error.message});
            console.log("Error****:", error.message);
          });

        
       }
}