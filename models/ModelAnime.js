const { animesdb } = require('./db-animes');
class ModelAnime {
  constructor() {
    this.db = animesdb;
  }

  new(anime) {
    return new Promise((resolve, reject) => {
      this.db.insert(anime, function(err, record) {
    		if (err) {
          reject(new Error(err));
    			return;
    		}
    		resolve(record);
    	});
    });
  }
}

exports.ModelAnime = ModelAnime;