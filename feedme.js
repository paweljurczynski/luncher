const restaurants = [
    require('./emalia'),
    require('./ogrod'),
    require('./szuwary'),
];

restaurants.forEach(restaurant => restaurant.log());
