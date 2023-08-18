const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
    if (error) {
        console.log("It didn't work!", error);
        return;
    }

    //     console.log('It worked! Returned IP:', ip);
    // });

    fetchCoordsByIP('96.51.225.47', (error, coords) => {
            if (error) {
                console.log(error);
                return;
            }

            console.log(coords);
        });
});


