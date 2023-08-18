const database = require('mime-db');
const request = require('request');


const fetchMyIP = function (callback) {
    const url = 'https://api.ipify.org?format=json';

    request(url, (error, response, body) => {
        if (error) {
            callback(error, null);
            return;
        }
        if (response.statusCode !== 200) {
            const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
            callback(Error(msg), null);
            return;
        }

        const ip = JSON.parse(body).ip;
        callback(null, ip);
    });
};

const fetchCoordsByIP = function(ip, callback) {
    request(`http://ipwho.is/${ip}`, (error, response, body) => {
  
      if (error) {
        callback(error, null);
        return;
      }
  
      const parsedBody = JSON.parse(body);
  
      if (!parsedBody.success) {
        const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
        callback(Error(message), null);
        return;
      } 
  
      const { latitude, longitude } = parsedBody;
  
      callback(null, {latitude, longitude});
    });
  };
module.exports = {
    fetchMyIP,
    fetchCoordsByIP
};
