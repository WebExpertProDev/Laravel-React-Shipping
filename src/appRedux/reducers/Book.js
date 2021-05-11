import {
    FETCH_ERROR, 
    BOOK_STEP_NEXT, 
    BOOK_STEP_PREV,
    GET_SERVICE_SUCCESS,
    GET_SPECIFIC_SERVICE_SUCCESS,
    POST_BOOK_SHIPMENT_SUCCESS,
    SAVE_SHIPMENT_DATA
} from '../../constants/ActionTypes'

const INIT_STATE = {
    current: 0,
    shipmentType: null,
    bookFrom : {
        countryName: null,
        countryCode: null,
        postalCode: null
    },
    bookTo: {
        countryName: null,
        countryCode: null,
        postalCode: null
    },
    services: [],
    service: {
        serviceCode: null,
        serviceName: null,
        serviceCompany: null
    },
    adnlServices: [],
    adnlService: {
        adnlServiceCode: null,
        adnlServiceName: null
    },
    items: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case BOOK_STEP_NEXT: {
        return {
            ...state,
            current: state.current + 1
        }
    }
    case BOOK_STEP_PREV: {
        return {
            ...state,
            current: state.current - 1
        }
    }
    case GET_SERVICE_SUCCESS: {
        return {
            ...state,
            services: action.payload
        }
    }
    case GET_SPECIFIC_SERVICE_SUCCESS: {
        return {
            ...state,
            service: {
                serviceCode: action.payload.serviceCode,
                serviceName: action.payload.serviceName,
                serviceCompany: action.payload.serviceCompany
            },
            adnlServices: action.payload.adnlServiceCode
        }
    }
    case POST_BOOK_SHIPMENT_SUCCESS: {
        return {
            ...INIT_STATE
        }
    }
    case SAVE_SHIPMENT_DATA: {
        return {
            ...state,
            bookFrom: {
                countryName: action.payload.countryFrom,
                countryCode: action.payload.countryFrom,
                postalCode: action.payload.postalCodeFrom
            },
            bookTo: {
                countryName: action.payload.countryTo,
                countryCode: action.payload.countryTo,
                postalCode: action.payload.postalCodeTo
            },
            items: action.payload.items
        }
    }

    default:
      return state;
  }
}
