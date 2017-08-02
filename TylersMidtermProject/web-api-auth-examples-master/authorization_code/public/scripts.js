var app = {

	playlistTracks : [],
	playlistBPMS : [],
	recommendedTracks : [],
	recommendationBPMS : [],
	sortedplaylist: [],
	sortedBPMS: [],

	initialize: function() {
		app.getPlaylist();
	},

	sortPlaylist: function(){
		app.sortedplaylist = app.playlistTracks;
		app.sortedBPMS = app.playlistBPMS;
		for (var i = 0; i < app.playlistTracks.length; i++){
			for (var k = 1 + i; k < app.playlistTracks.length; k++){
				if (app.sortedBPMS[i].tempo > app.sortedBPMS[k].tempo){
					flippy = app.sortedplaylist[k];
					floppy = app.sortedplaylist[i];
					app.sortedplaylist[k] = floppy;
					app.sortedplaylist[i] = flippy;
					flip = app.sortedBPMS[k];
					flop = app.sortedBPMS[i];
					app.sortedBPMS[k] = flop;
					app.sortedBPMS[i] = flip;
				}
			}
		}
		app.makeSortedPlaylistHTML();
	},

	makeSortedPlaylistHTML: function() {
		var theHTML = "<h3> Playlist </h3>";
		theHTML += "<table class='playlistitems'>";
		theHTML += "<tr>" + "<th>Artist</th>" + "<th>Track</th>" + "<th>BPM</th>" + "</tr>";
		theHTML += "</table>" ;
		$('main').append(theHTML);
		var moreHTML = '';
		for (var i = 0; i < app.playlistTracks.length; i++){
			if (i % 2 == 0){
				moreHTML += "<tr" + "  "  + "class=" + "even" + "  " + 'id=' + i + ">";
			}
			else{
				moreHTML += "<tr" + "  " + 'id=' + i + ">";
			}
			moreHTML += "<td>" + app.sortedplaylist[i].track.artists[0].name + "</td>";
			moreHTML += "<td>" + app.sortedplaylist[i].track.name + "</td>";
			moreHTML += "<td>" + app.sortedBPMS[i].tempo + "</td>";
			// moreHTML += "<td>" + "<img src='" + app.sortedplaylist[i].track.album.images[0].url + "'/>" + "</td>";
			moreHTML += "</tr>";
			
		}

		$('.playlistitems').append(moreHTML);
		app.initializeSortedClick();
		app.makeDiscogsModal();
	},

	makeRecommendationHTML: function() {
		var theHTML = "<h3> Recommendations </h3>";
		theHTML += "<table class='recommendations'>";
		theHTML += "<tr>" + "<th>Artist</th>" + "<th>Track</th>" + "<th>BPM</th>" + "</tr>";
		theHTML += "</table>" ;
		$('nav').html(theHTML);
		var moreHTML = '';
		for (var i = 0; i < app.recommendedTracks.length; i++){
			if (i % 2 != 0){
				moreHTML += "<tr" + "  " + "class=" + "oddrec" + ">";
			}
			else{
				moreHTML += "<tr>";
			}
			moreHTML += "<td>" + app.recommendedTracks[i].artists[0].name + "</td>";
			moreHTML += "<td>" + app.recommendedTracks[i].name + "</td>";
			moreHTML += "<td>" + app.recommendationBPMS[i].tempo + "</td>";
			moreHTML += "</tr>";
		}
		$('.recommendations').append(moreHTML);
	},

	initializeSortedClick: function() {
		$(function(){
			var ids = '';
			var $tracks = $('tr');
			$tracks.on('click', function(){
				console.log(this.id);
				var recommendationID = app.sortedplaylist[this.id].track.id;
				var recommendationBPM = app.sortedBPMS[this.id].tempo;
				console.log(recommendationID, recommendationBPM);
				app.getSpotifyRecommendations(recommendationID);
			});
		});
	},

	makeDiscogsModal: function(){
		$(function(){
		// Get the modal
		console.log("IMWORKING");
		var ids = '';
		var $tracks = $('tr');
		var modal = document.getElementById('myModal');
		$tracks.on("contextmenu", function(){
			console.log("discogs right click this");
			console.log(app.sortedplaylist[this.id].track.album.name);
			console.log(app.sortedplaylist[this.id].track.artists[0].name);
			app.DiscogsSearch(app.sortedplaylist[this.id].track.name, app.sortedplaylist[this.id].track.artists[0].name);
			var modal = document.getElementById('myModal');
			modal.style.display = "block";
			return false;
		});
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
	});

		
	},

	populateDiscogsModal: function(artist, track, year, numForSale, lowestPrice, have, want, rating, numRatings, uri){
		var moreHTML = '';
		moreHTML += "<tr>" + "<td>" + "Artist" + "</td>" + "<td>" + artist + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Track Name" + "</td>" + "<td>" + track + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Release Date" + "</td>" + "<td>" + year + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Number For Sale" + "</td>" + "<td>" + numForSale + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Lowest Price Available" + "</td>" + "<td>" + "$" + lowestPrice + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Owned By" + "</td>" + "<td>" + have + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Wanted By" + "</td>" + "<td>" + want + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Average Rating" + "</td>" + "<td>" + rating + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Number of Ratings" + "</td>" + "<td>" + numRatings + "</td>" + "</tr>";
		moreHTML += "<tr>" + "<td>" + "Discogs Link" + "</td>" + "<td>" + uri + "</td>" + "</tr>";
		$('.DiscogsInfo').html(moreHTML);
	},

	DiscogsSearch: function(release, artist) {
		console.log("Get Discogs");
		var spotifyURL = 'https://api.discogs.com/database/search?q=?';
		console.log(artist);
		console.log(release);
		var key = 'bsIqdNRottjcwAlywdms';
		var secret = 'VarafRnDMykSDvJxJlMPczjKBrnFXmTH';
		var mySpotifyReqURL = spotifyURL + artist + " - " + release + '&key=' + key + '&secret=' + secret;  
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET', 
			dataType: 'json',

			error: function(err){
				console.log("couldnt search discogs");
				console.log(err);
			},
			success: function(data){
				console.log(data);
				console.log("DISCSearch: EFFECTIVE!");
				console.log(data);
				console.log(data.results[0].resource_url);
				app.getDiscogsInfo(data.results[0].resource_url);
			}
		});
	},

	getDiscogsInfo: function(releaseURL) {
		console.log("Get Discogs");
		var mySpotifyReqURL = releaseURL;
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			error: function(err){
				console.log("poopooo...");
				console.log(err);
			},
			success: function(data){
				console.log("DISCGS INFORM!");
				console.log(data);

				if(data.community && !data.uri){
					app.populateDiscogsModal(data.artists[0].name, data.title, data.year, data.num_for_sale, data.lowest_price, data.community.have, data.community.want, data.community.rating.average, data.community.rating.count, "N/A");
				}
				if(!data.community && data.uri){
					app.populateDiscogsModal(data.artists[0].name, data.title, data.year, data.num_for_sale, data.lowest_price, "N/A", "N/A", "N/A", "N/A", data.uri);
				}
				if(data.community && data.uri){
					app.populateDiscogsModal(data.artists[0].name, data.title, data.year, data.num_for_sale, data.lowest_price, data.community.have, data.community.want, data.community.rating.average, data.community.rating.count, data.uri);
				}
				else{
					app.populateDiscogsModal(data.artists[0].name, data.title, data.year, data.num_for_sale, data.lowest_price, "N/A", "N/A", "N/A", "N/A", "N/A");
				}
			}
		});
	},

	getPlaylist: function() {
		var key = localStorage.getItem("jammer");
		console.log("Get Playlist");
		var spotifyURL = 'https://api.spotify.com/v1/users/';
		var userID = "122514310";
		var playlistID = "77fAYvRZgDXuBoTFxfMPbK";
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL + userID + "/playlists/" + playlistID;
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("Uh oh...");
				console.log(err);
			},
			success: function(data){
				//console.log(data);
				console.log("Cool! I found the playlist you were looking for!");
				console.log(data);
				app.playlistTracks = data.tracks.items;
				app.getBPMandKey();
			}
		});
	},

	getBPMandKey: function() {
		var key = localStorage.getItem("jammer");
		console.log("get BPM and Key");
		var spotifyURL = 'https://api.spotify.com/v1/audio-features/?ids=';
		for (var i = 0; i < app.playlistTracks.length; i++){
			spotifyURL += app.playlistTracks[i].track.id + ',';
		}
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL;
		console.log(mySpotifyReqURL);
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("WHERES MY BPM DAMNIT");
				console.log(err);
			},
			success: function(data){
				//console.log(data);
				console.log("Cool! I found some BPMS!");
				console.log(data);
				app.playlistBPMS = data.audio_features;
				console.log(app.playlistBPMS);
				app.sortPlaylist();
				// app.makePlaylistHTML();
			}
		});
	},

	getRecommendationBPMandKey: function() {
		var key = localStorage.getItem("jammer");
		console.log("get Recommendations BPM and Key");
		var spotifyURL = 'https://api.spotify.com/v1/audio-features/?ids=';
		for (var i = 0; i < app.recommendedTracks.length; i++){
			spotifyURL += app.recommendedTracks[i].id + ',';
		}
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL;
		console.log(mySpotifyReqURL);
		$.ajax({
			url: mySpotifyReqURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("WHERES MY Recommendation BPM DAMNIT");
				console.log(err);
			},
			success: function(data){
				//console.log(data);
				console.log("Cool! I found some recommendations BPMS!");
				console.log(data);
				app.recommendationBPMS = data.audio_features;
				app.makeRecommendationHTML();
			}
		});
	},

	getSpotifyRecommendations: function(recommendationID, recommendationBPM) {
		var key = localStorage.getItem("jammer");
		console.log("Get Spotify Recommendations");
		var spotifyURL = 'https://api.spotify.com/v1/recommendations?seed_tracks=';
		// for (var i = 0; i < app.playlistTracks.length; i++){
		// 	spotifyURL += app.playlistTracks[i].track.id + ',';
		// }
		spotifyURL += recommendationID + ",";
		spotifyURL += "&tempo=";
		spotifyURL += recommendationBPM + ",";
		var mySpotifyKey = key;
		var mySpotifyReqURL = spotifyURL;
		console.log('NICE!');
		$.ajax({
			url: spotifyURL,
			type: 'GET',
			dataType: 'json',
			headers: {
				'Authorization': 'Bearer ' + mySpotifyKey
			},
			error: function(err){
				console.log("Uh oh...");
				console.log(err);
			},
			success: function(data){
				//console.log(data);
				console.log("sweeeGet Spotify Recommendationseet");
				console.log(data);
				app.recommendedTracks = data.tracks;
				console.log(app.recommendedTracks);
				app.getRecommendationBPMandKey();
			}
		});
	}
};

//  SCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILE SCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILESCRAP PILE

/*

curl -X "POST" -H "Authorization: Basic MmI5NTk4YjU0NWRkNDQyMGJiOTViNmY0OGU4MTYyNmI6OTY0YThlN2I0OWM1NDA2ZWE2NTU0Mzk5MjYzZDcyM2U=" -d grant_type=client_credentials https://accounts.spotify.com/api/token

curl -X GET "https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp" -H "Authorization: Bearer BQAhUlCFHXXOJ5BHR1g45AhUuT-fpaqQZ22oK_cOIf68T39YX406phiegI6ElQmeCBNFV2b_YFuEiG9CjsHmQQ"

*/

	// initializePlaylistClick: function() {
	// 	$(function(){
	// 		var ids = '';
	// 		var $tracks = $('li');
	// 		$tracks.on('click', function(){
	// 			console.log(this.id);
	// 			var recommendationID = app.playlistTracks[this.id].track.id;
	// 			var recommendationBPM = app.playlistBPMS[this.id].tempo;
	// 			console.log(recommendationID, recommendationBPM);
	// 			app.getSpotifyRecommendations(recommendationID);

	// 		});
	// 	});
	// },

	// makePlaylistHTML: function() {
	// 	// var theHTML = "<div class='playlistitems'>";
	// 	// theHTML += "</div>";
	// 	// $('main').append(theHTML);
	// 	// var moreHTML = '';
	// 	// for (var i = 0; i < app.playlistTracks.length; i++){
	// 	// 	moreHTML += "<li" + "  " + 'id=' + i + ">" + app.playlistBPMS[i].tempo + "  " + app.playlistTracks[i].track.artists[0].name + " - " + app.playlistTracks[i].track.name + "</li>" + "<br>";
	// 	// 	// + "class=" + "playlisto"
	// 	// 	// theHTML += "<img src='" + app.playlistTracks[i].track.album.images[0].url + "'/>";
	// 	// }
	// 	// $('.playlistitems').append(moreHTML);
	// 	// app.initializePlaylistClick();
	// 	app.sortPlaylist();
	// },

	// getUserPlaylists: function() {
	// 	var key = localStorage.getItem("jammer");
	// 	var mySpotifyKey = key;
	// 	console.log("Get User Playlists");
	// 	var spotifyURL = 'https://api.spotify.com/v1/users/';
	// 	var userID = "122514310";
	// 	var mySpotifyReqURL = spotifyURL + userID + "/playlists";
	// 	$.ajax({
	// 		url: mySpotifyReqURL,
	// 		type: 'GET',
	// 		dataType: 'json',
	// 		headers: {
	// 			'Authorization': 'Bearer ' + key

	// 		},
	// 		error: function(err){
	// 			console.log("Uh oh...");
	// 			console.log(err);
	// 		},
	// 		success: function(data){
	// 			//console.log(data);
	// 			console.log("I found some user playlists.");
	// 			console.log(data);
	// 		}
	// 	});
	// },