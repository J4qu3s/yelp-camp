const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("DB connected")
});
/* 
const randCity = cities[Math.floor(Math.random() * cities.length)].city;

const addToDB = (howMany) => {
    for(var i = 0; i < howMany; i++){
        new Campground({
            location : `${randCity}`

        })
    }
}; */

const makePrice = () => {
    return Math.floor(Math.random() * 100);
}

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++){
        //const rand1000 = Math.floor(Math.random() * cities.length);
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '614413efd862671e2ca1c154',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores impedit, deserunt reiciendis odit obcaecati velit cum repellat earum autem nam.',
            price : makePrice(),
            images: [
                {
                  url: 'https://res.cloudinary.com/dy6eadhdv/image/upload/v1633525569/YelpCamp/qzd6mohuzzkei5scafyr.jpg',
                  filename: 'YelpCamp/qzd6mohuzzkei5scafyr'
                },
                {
                  url: 'https://res.cloudinary.com/dy6eadhdv/image/upload/v1633525570/YelpCamp/pmc2iko4igwmcg4gcuni.jpg',
                  filename: 'YelpCamp/pmc2iko4igwmcg4gcuni'
                }
              ],
              geometry: { 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ], 
                  type: 'Point' 
                }           
        });
        await camp.save();
    }
    
}

    seedDB().then(() => db.close());