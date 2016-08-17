app.service('artistService', function($q) {

	var getArtists = function() {
		var defer = $q.defer();
		var ArtistObject = Parse.Object.extend("Artist");
		var query = new Parse.Query(ArtistObject);

		query.find({
			success: function(results) {
				defer.resolve(results);
			},
			error: function(error) {
				defer.reject(error);
			}
		});
		return defer.promise;
	};

	var getArtistById = function(id) {
		var defer = $q.defer();
		var ArtistObject = Parse.Object.extend("Artist");
		var query = new Parse.Query(ArtistObject);

		if(id){
			query.equalTo("objectId", id);
		}

		query.find({
			success: function(results) {
				defer.resolve(results);
			},
			error: function(error) {
				defer.reject(error);
			}
		});
		return defer.promise;
	};

	return {
		getArtists: getArtists,
		getArtistById : getArtistById
	};

});
