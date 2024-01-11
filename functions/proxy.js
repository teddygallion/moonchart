// proxy.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { queryStringParameters } = event;
    const apiUrl = 'https://aa.usno.navy.mil/api/moon/phases/date';
    
    if (!queryStringParameters.date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Date parameter is required' }),
      };
    }

    const queryParams = new URLSearchParams(queryStringParameters);
    const url = `${apiUrl}?${queryParams.toString()}`;
    
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
