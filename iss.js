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

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
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

  /**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
    const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

    request(url, (error, response, body) => {
        if (error) {
            callback(error, null);
            return;
        }
        if (response.statusCode !== 200) {
            const message = `Status Code ${response.statusCode} when fecthing ISS flyover times. Response: ${body}`;
            callback(Error(message), null);
            return;
        }
        const flyoverTimes = JSON.parse(body).response;
        callback(null, flyoverTimes);
    })
  };

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};;

module.exports = { nextISSTimesForMyLocation };
