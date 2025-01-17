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

export const ShiftDetails = async id => {
  let token = await GetAsyncData('token');
  try {
    let response = await fetch(
      `${BaseUrl}/query/?q=SELECT+Id,+Name,+Shift_Start_Time__c,+Shift_End_Time__c,+Shift_Date__c FROM Shift__c where Contact__c='${id}'+ AND+Shift_Date__c>=2025-01-15`,
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

export const AttendanceUpdate = async (data, userid) => {
  let token = await GetAsyncData('token');
  try {
    let response = await fetch(`${BaseUrl}/sobjects/Attendence__c/${userid}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      console.log('No content response: Success');
      return { success: true };
    }

    if (response.ok) {
      const responseText = await response.text();
      const jsonResponse = responseText ? JSON.parse(responseText) : null;
      console.log(jsonResponse);
      return jsonResponse;
    }
    const errorMessage = `Error: ${response.status} ${response.statusText}`;
    console.error(errorMessage);
    throw new Error(errorMessage);

  } catch (error) {
    console.error('Error during fetch or JSON parsing:', error);
    return { status: false, error: error.message };
  }
};

export const GetDailyShiftdetails = async (userid, date) => {
  let token = await GetAsyncData('token');
  try {
    let response = await fetch(
      `${BaseUrl}/query/?q=SELECT+Id,+Name,+Actual_Hours__c,+Extra_Hours__c,+Logged_Date__c,+Login_Location__c,+Logout_Location__c,+Time_In__c,+Time_out__c,+Total_Work_Hours__c+FROM+Attendence__c+WHERE+Logged_Date__c=${date}+AND+Contact__c='${userid}'`,
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
