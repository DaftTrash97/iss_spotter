const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//     if (error) {
//         console.log("It didn't work!", error);
//         return;
//     }

//     //     console.log('It worked! Returned IP:', ip);
//     // });

//     fetchCoordsByIP('96.51.225.47', (error, coords) => {
//         if (error) {
//             console.log(error);
//             return;
//         }

//         console.log(coords);

//         fetchISSFlyOverTimes(coords, (error, flyoverTimes) => {
//             if (error) {
//                 console.log(error);
//                 return;
//             }

//             console.log(flyoverTimes);
//         });
//     });
// });

const printPassTimes = function(passTimes) {
    for (const pass of passTimes) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(pass.risetime);
      const duration = pass.duration;
      console.log(`Next pass at ${datetime} for ${duration} seconds!`);
    }
  };
  
  nextISSTimesForMyLocation((error, passTimes) => {
    if (error) {
      return console.log("It didn't work!", error);
    }
    // success, print out the deets!
    printPassTimes(passTimes);
  });