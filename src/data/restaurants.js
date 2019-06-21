const getters = require("../getters");

const restaurants = [
  { name: "Szuwary Cafe", pageId: "SzuwaryCafe", getter: getters.one, emoji: '🦚' },
  { name: "Ogród Kulinarny", pageId: "OgrodKulinarny", getter: getters.one, emoji: '🍕' },
  { name: 'Bal', pageId: 'balnazablociu', getter: getters.one, emoji: '🎻' },
  { name: "Emalia", pageId: "Emaliazablocie", getter: getters.batch, emoji: '🍵'}
];

module.exports = restaurants;
