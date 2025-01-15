import {GetAsyncData} from '../Helper/AsyncStorage';
import {BaseUrl} from './Constants';

export const TokenCreation = async () => {
  try {
    let response = await fetch(
      `https://test.salesforce.com/services/oauth2/token?username=steven@bnkservices.com.au.mobileapp&password=Ugrinovski10&client_id=3MVG9xKUwMLOA4CxO8mF0oId3pJz9AIOgXH.U949Lc2bHn4LE9Mz98mYCJiDFFjCOszzpKpxdGWU5sonArz9i&redirect_uri=https://test.salesforce.com&grant_type=password&client_secret=FE486420DA18CEEEF3F10EA16F13CC021E85FF1C4769296F7A40A84C6B83415C`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      },
    );
    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

export const LoginApi = async email => {
  let token = await GetAsyncData('token');
  console.log(token);
  try {
    let response = await fetch(
      `${BaseUrl}/query/?q=SELECT+Id+FROM+Contact+WHERE+Email='${email}'`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

export const AttendanceCreation = async data => {
  let token = await GetAsyncData('token');
  try {
    let response = await fetch(`${BaseUrl}/sobjects/Attendence__c`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};

export const AttendanceUpdate = async (data, id) => {
  let token = await GetAsyncData('token');
  try {
    let response = await fetch(`${BaseUrl}/sobjects/Attendence__c/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    response = await response.json();
    return response;
  } catch (error) {
    return error.message;
  }
};
