import { DONORLIST_REQ, DONORLIST_SUCCESS, DONORLIST_FAILURE } from './actionTypes'
  
  const initialState = {
    loading: false,
    donorList: [],
    error: '',
  };
  
  const activedonorReducer  = (state = initialState, action) => {
      switch (action.type) {
         
        case DONORLIST_REQ: {
          return {...state, loading: true};
        }
        case DONORLIST_SUCCESS: {
          return {
            ...state,
            loading: false,
            error: '',
            donorList: action.donorList,
          };
        }
        case DONORLIST_FAILURE: {
          return {
            ...state,
            loading: false,
            error: action.error,
            donorList: [],
          };
        }
        default: {
          return state;
        }
      }
  }
  
  export default activedonorReducer