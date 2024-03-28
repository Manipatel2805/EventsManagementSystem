const con = require("../database/database");
const axios = require("axios");

exports.ModelEventsLoad=(data)=>{
    return new Promise((resolve, reject) => {
    const {event_name, city_name, date, time, latitude,longitude}=data
    const sqlquery = 'INSERT INTO eventsdata (event_name, city_name, date, time, latitude,longitude) VALUES (?, ?, ?, ?, ?,?)';
    con.query(sqlquery, [event_name, city_name, date, time, latitude,longitude], (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve({ message: 'Successfully entered' });
        }
    });

    })
}


exports.ModelEventsFind = (latitude, longitude, date, endDate,page) => {
    return new Promise((resolve, reject) => {
    
        const sql = "SELECT * FROM eventsdata WHERE date BETWEEN ? AND ?;";
        con.query(sql, [date, endDate,page], async (err, results) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const eventsWithWeatherAndDistance = await Promise.all(results.map(async (event) => {
                        const weather = await fetchWeather(event.city_name, event.date);
                        const distance = await calculateDistance(latitude, longitude, event.latitude, event.longitude);
            
                        return {
                            event_name: event.event_name,
                            city_name: event.city_name,
                            date: event.date,
                            weather,
                            distance
                        };
                    }));
                    const sortedEvents = eventsWithWeatherAndDistance.sort((a, b) => new Date(a.date) - new Date(b.date));

                    const pageSize = 10;
                    const startIndex = (page - 1) * pageSize;
                    const endIndex = page * pageSize;
                    const eventsForPage = sortedEvents.slice(startIndex, endIndex);

                    const responseObject = {
                        events: eventsForPage,
                        page: parseInt(page),
                        pageSize: pageSize,
                        totalEvents: sortedEvents.length,
                        totalPages: Math.ceil(sortedEvents.length / pageSize)
                    };

                    resolve(responseObject);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
};

async function fetchWeather(city_name, date) {
    try {
        const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${encodeURIComponent(city_name)}&date=${date}`);
                                        
        return response.data.weather;
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
}

async function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    try {
        const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`);
        return response.data.distance;
    } catch (error) {
        throw new Error('Failed to calculate distance');
    }
}