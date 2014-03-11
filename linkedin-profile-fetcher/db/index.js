
var mongojs = require('mongojs'),
  DB_NAME = 'linkedin',
  COLLECTIONS = {
    FULL: 'full',
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

  saveFull: function (data) {
      data['_id'] = data['id'];
      db[COLLECTIONS.FULL].save(data);
  },

    fetchFull: function(id, callback) {
        return db[COLLECTIONS.FULL].findOne({'id': id}, callback);
    },

  getPeople: function (id, callback) {
    return db[COLLECTIONS.PEOPLE].findOne({'id': id}, callback);
  },

  getCompany: function (id, callback) {
    return db[COLLECTIONS.COMPANIES].findOne({'id': id}, callback);
  }


};