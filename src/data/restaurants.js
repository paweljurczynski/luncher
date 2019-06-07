const getters = require('../getters');

const restaurants = [
    { name: 'Szuwary Cafe', pageId: 'SzuwaryCafe', getter: getters.one },
    { name: 'Ogród Kulinarny', pageId: 'OgrodKulinarny', getter: getters.one },
    { name: 'Bal', pageId: 'balnazablociu', getter: getters.one },
    { name: 'Emalia', pageId: 'Emaliazablocie', getter: getters.batchSmall }
];

module.exports = restaurants;
