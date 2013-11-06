
var mongojs = require('mongojs'),
  DB_NAME = 'linkedin',
  COLLECTIONS = {
    PEOPLE: 'people',
    COMPANIES: 'companies'
  },
  db = mongojs(DB_NAME, Object.keys(COLLECTIONS).map(function (key) {
    return COLLECTIONS[key];
  }));

module.exports = {
  savePeople: function (data) {
    data['_id'] = data['id'];
    db[COLLECTIONS.PEOPLE].save(data);
  },

  getPeople: function (id, callback) {
    return db[COLLECTIONS.PEOPLE].findOne({'id': id}, callback);
  },

  getCompany: function (id, callback) {
    return db[COLLECTIONS.COMPANIES].findOne({'id': id}, callback);
  }


};