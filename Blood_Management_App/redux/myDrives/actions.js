/* eslint-disable prettier/prettier */
import {
  FETCH_DRIVES_REQ,
  FETCH_DRIVES_SUCCESS,
  DRIVE_CANCEL_SUCCESS,
  FETCH_LIST_SUCCESS,
  FETCH_DRIVES_FAILURE,
  DONATION_VERIFICATION,
} from './actionTypes';
import axios from 'axios';

export const fetchDrivesReq = () => ({
  type: FETCH_DRIVES_REQ,
});

export const fetchDriveSuccess = (myDrivesData) => ({
  type: FETCH_DRIVES_SUCCESS,
  myDrivesData,
});

export const fetchListSuccess = (donorsList) => ({
  type: FETCH_LIST_SUCCESS,
  donorsList,
});

export const driveCancelSuccess = (driveId) => ({
  type: DRIVE_CANCEL_SUCCESS,
  driveId,
});

export const fetchDriveFailure = (error) => ({
  type: FETCH_DRIVES_FAILURE,
  error,
});

//* USE THIS TO SET THE VALUE OF "DONOR HAS GIVEN" BLOOD STATUS TO FALSE
export const donationVerification = (driveId, donorId) => ({
  type: DONATION_VERIFICATION,
  driveId,
  donorId,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
//? GET LIST OF DRIVES

export const getDriveData = (userToken) => {
  return async (dispatch) => {
    dispatch(fetchDrivesReq());
    try {
      console.log('sending axios get request!');
      const response = await axios.get('http://192.168.43.89:5000/mydrives', {
        headers: {Authorization: userToken},
      });

      if (response.data.success) {
        console.log('response is success!');
        dispatch(fetchDriveSuccess(response.data.driveData));
      } else if (response.data.error) {
        console.log('response is error!');
        dispatch(fetchDriveFailure(response.data.error));
      } else {
        console.log('outlandish error!');
        dispatch(
          fetchDriveFailure(
            "Something's not right! please try again after some time.",
          ),
        );
      }
    } catch (err) {
      console.log('caught error on myDriveData get request: ', err);
      dispatch(fetchDriveFailure(err.message));
    }
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
//? GET LIST OF DONORS FOR A PARTICULAR DRIVE

export const getDonorList = (userToken, driveId) => {
  return async (dispatch) => {
    dispatch(fetchDrivesReq());
    try {
      console.log('sending axios list post request!');
      const response = await axios.post(
        'http://192.168.43.89:5000/donorList',
        {driveId},
        {
          headers: {Authorization: userToken},
        },
      );

      if (response.data.success) {
        console.log('response is success!');
        //? SET THIS PROP NAME ACCORDING TO BACK END
        // console.log(response.data.acceptedDonors);
        dispatch(fetchListSuccess(response.data.acceptedDonors));
      } else if (response.data.error) {
        console.log('response is error!');
        dispatch(fetchDriveFailure(response.data.error));
      } else {
        console.log('outlandish error!');
        dispatch(
          fetchDriveFailure(
            "Something's not right! please try again after some time.",
          ),
        );
      }
    } catch (err) {
      console.log('caught error on donor list get request: ', err);
      dispatch(fetchDriveFailure(err.message));
    }
  };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//? POST DATA THAT A USER HAS DONATED BLOOD.

export const donorVerification = (userToken, driveId, donorId) => {
  return async (dispatch) => {
    console.log(
      'donorVerification api request for my donation drives started!',
    );
    try {
      dispatch(fetchDrivesReq());
      console.log("posting updated data to current user's records");
      const response = await axios.post(
        'http://192.168.43.89:5000/mydrives',
        {driveId, donorId},
        {
          headers: {Authorization: userToken},
        },
      );

      if (response.data.success) {
        console.log('donor verification complete!');
        //? coordinate with back end team to fixate on this response with the same name.
        dispatch(donationVerification(driveId, donorId));
      } else if (response.data.error) {
        dispatch(fetchDriveFailure(response.data.error));
      } else {
        dispatch(
          fetchDriveFailure(
            "Something's not right! Please try after some time.",
          ),
        );
      }
    } catch (err) {
      dispatch(fetchDriveFailure(err.message));
      console.log(
        'Error caught while data posting in my donation drives.',
        err.message,
      );
    }
  };
};

////////////////////////////////////////////////////////////
//? CANCEL A DRIVE

export const driveCancellation = (userToken, driveId) => {
  return async (dispatch) => {
    console.log('drive cancellation started!');
    try {
      dispatch(fetchDrivesReq());
      console.log("posting updated data to current user's records");
      const response = await axios.post(
        'http://192.168.43.89:5000/canceldrive',
        {driveId},
        {
          headers: {Authorization: userToken},
        },
      );

      if (response.data.success) {
        console.log('drive cancellation successful');
        //? coordinate with back end team to fixate on this response with the same name.
        dispatch(driveCancelSuccess(driveId));
      } else if (response.data.error) {
        dispatch(fetchDriveFailure(response.data.error));
      } else {
        dispatch(
          fetchDriveFailure(
            "Something's not right! Please try after some time.",
          ),
        );
      }
    } catch (err) {
      dispatch(fetchDriveFailure(err.message));
      console.log('Error caught while cancelling drive.', err.message);
    }
  };
};
