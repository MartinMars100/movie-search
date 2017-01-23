'use strict';
console.log('log version a');

var movieSearch = (function(){
  var movie = []; // New Array literal notation
  
  return {
    listenSearch: function() {     // Search for title click button
      if ((movie.length == 0) && (null !== history.state)) { //We came from the imdb site
        var id = history.state;  // pass id to loadDetailsReturn
        movieSearch.loadDetailsReturn(id);  
      } 

      var searchInput = '';
      $("#submit").on('click', function(e) {      // If anything is entered in search field
      e.preventDefault();
      $('.main-header2').remove(); // Remove movie detail and clear the page except for header
      $('#main').remove(); // Remove the movie search result html
      $('#movieDetail').remove(); // Remove the movie detail html
      
      var statusHTML = '';   //Below we load the top header and search fields
      statusHTML += '<div class="main-content clearfix" id="main">';
      statusHTML += '<ul id="movies"><li class="desc">';
      statusHTML += '<i class="material-icons icn-movie">movie</i>';
      statusHTML += 'Search movie titles and TV shows</li></ul></div>';
      $('body').append(statusHTML);
      searchInput = $('#search').val().toLowerCase();
      searchInput = searchInput.trim();
      var url = 'https://www.omdbapi.com/';
      var searchTitle = searchInput;
      var searchYear = $('#year').val();
      var data = {
        s: searchTitle,
        y: searchYear
      };
  
      movieSearch.dataGet(url, data); // go get all the movies that match this search
      
      }); // end submit click function
      }, // end listenSearch
    
    Movie: function(id, poster, title, year, link, rated, plot) { // Constructor Function
      this.id = id;
      this.poster = poster;
      this.title = title;
      this.year = year;
    }, // end Movie function

    linktoIMDB: function(key){ // link to IMDB site
      var locationBuild = '';
      locationBuild += 'https://www.imdb.com/title/' + history.state; 
      // locationBuild += movie[key].id;
      window.location.href = locationBuild;
    }, // end linktoIMDB
    
    loadDetails: function(key) { // This detail shows the movie that was clicked from search results
      // When we link to another site we need to be able to return to the
      // same page we linked from (on our site).
      // We do this by pushing a variable to history state
      var stateId = movie[key].id;       // movie array is global  
      history.pushState(stateId, null, null);  
      var url = 'https://www.omdbapi.com/';
      var id = movie[key].id; 
      var dataDetails = {
        i: id,
        plot: "short"
      };
      
      var request = $.getJSON (url, dataDetails);
      request.error(function(jqXHR, textStatus, errorThrown) {
      if (textStatus == 'timeout')
        console.log('The server is not responding');
    
      if (textStatus == 'error')
        console.log('loadDetailsReturn - Error Thrown = ' + errorThrown);
      });
      
      request.success(function(response) { // The request was successful
        console.log(response);
        var statusHTML = '';
        // var id = response.imdbID;
        $('#main').remove(); // Remove the search return movies to clear the page except for header
        statusHTML += '<div class="grid-container main-header2">';
        statusHTML += '<h1 class="grid-1 main-logo"><a href="#" onclick = movieSearch.searchReturn()><i class="material-icons icn-search">keyboard_arrow_left</i></a></h1>';
        statusHTML += '<ul class="grid-8 main-nav">';
        statusHTML += '<li><a href=”#”>Search Results</a></li>';
        statusHTML += '<li><a href=”#”></a></li>';
        statusHTML += '</ul></div>';
        statusHTML += '<div class="grid-container" id="movieDetail">';
        statusHTML += '<div class="grid-5" id="col-1">';
        statusHTML += '<img class="desc-movie-poster" src="' + movie[key].poster + '">';
        statusHTML += '</div>';
        statusHTML += '<div class="grid-7" id="col-2"><h2 id="titleDetail">' + movie[key].title + '</h2>';
        statusHTML += '<h3 id="ratingDetail"> IMDB Rating ' + response.Rated + '</h3>';
        statusHTML += '<h3 id="plotSynopsis">Plot Synopsis</h3>';
        statusHTML += '<h3 id="plotDetail">' + response.Plot + '</h3>';
        statusHTML += '<h3 id="button-toIMDB" onclick = movieSearch.linktoIMDB()>View on IMDB</h3>';
        statusHTML += '</div></div>';
        $('body').append(statusHTML);
      });
    }, //end loadDetails

    dataGet: function(url, data) { //Get all the movies that match our search 
      movie = new Array();
      
      $.getJSON (url, data, function(response){
          $.each(response.Search, function (key, mov) {
            if (mov.Poster.length < 10) { // The poster detail probably reads "N/A"
            }
            else {
              mov.Poster = mov.Poster.replace(/^http:\/\//i, 'https://'); // replace poster link http with https
            }
            movie[key] = new movieSearch.Movie(mov.imdbID, mov.Poster, mov.Title, mov.Year); // Our movie constructor
          }); // end each
          if (movie.length > 0) { // If we found movies that matched our search
            movieSearch.changeURL(movie);
          } else {  // If we didn't find any movies that matched our search
            movieSearch.noneFound();
          }
      }); // end getJSON
    }, // end dataGet    
        
    changeURL: function(movie) { //If the poster img link does not work we should replace it with "N/A"
      var getCnt = 0;
       $.each(movie, function(key, value) {
         var url = this.poster;
         var jqxhr = $.get (url, function(key){  
       }).fail(function() {
       movie[key].poster = "N/A";
       }); // end fail  
       jqxhr.always(function() {
         if (getCnt == movie.length - 1 ){
          movieSearch.loadPage(movie); // Load the page with all of the movies that match our search
         }
         getCnt ++;
       });
     });
    }, //end changeURL
       
    noneFound: function() { // Load the message that says no movies matched that search 
      var searchTitle = $('#search').val();
      var searchYear = $('#year').val();
      var statusHTML = '';
      $('#movies').removeClass("movie-list");
      statusHTML += '<li class="no-movies">';
      if ($('#year').val() === '') {
        statusHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTitle;
      } else {
        statusHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTitle + '' + searchYear;
      }
      
      statusHTML += '</li>';
      $('#movies').html(statusHTML); 
    }, // end noneFound function
       
    loadPage: function(movie) { // Load all of the movies that match our search
      history.pushState(null, null, null); // set history push state to null
      if (!$("#movies").hasClass("movie-list")){
        $('#movies').addClass("movie-list");
      }
      var statusHTML = '';
      $('.loading-icon').show();
      $('.desc').hide();
      $.each(movie, function(key, value) {
        // statusHTML += '<li onclick = movieSearch.loadDetails(' + key + ',' + movie + ')>';
        statusHTML += '<li onclick = movieSearch.loadDetails(' + key + ')>';
        statusHTML += '<div class="poster-wrap">';
        if (movie[key].poster.length > 10) {
          statusHTML += '<img class="movie-poster" src="' + movie[key].poster + '">';
        }else {
          statusHTML += '<i class="material-icons poster-placeholder">crop_original</i>'; 
        } // end else
        statusHTML += '</div>';
        statusHTML += '<span class="movie-title">' + movie[key].title + '</span>';
        statusHTML += '<span class="movie-year">' + movie[key].year + '</span>';
        statusHTML += '</li>';
      }); // end each
      
    $('#movies').html(statusHTML); 
    }, // end loadPage function
      
    loadDetailsReturn: function(id) { // We linked to the imdb site from the detail info -- this returns to the same state or info
      var stateId = id; // We always set the state on the detail page in case it links to imdb
      history.pushState(stateId, null, null); 
      var url = 'https://www.omdbapi.com/';
      var dataDetails = {
        i: id,
        plot: "short"
      };
      
      var request = $.getJSON (url, dataDetails);
      request.error(function(jqXHR, textStatus, errorThrown) {
      if (textStatus == 'timeout')
        console.log('The server is not responding');
    
      if (textStatus == 'error')
        console.log('loadDetailsReturn - Error Thrown = ' + errorThrown);
      });
      
      request.success(function(response) {
        var statusHTML = '';
        $('#main').remove(); // Remove the search return movies to clear the page except for header
        statusHTML += '<div class="grid-container main-header2">';
        statusHTML += '<h1 class="grid-1 main-logo"><a href="#" onclick = movieSearch.searchReturn() ><i class="material-icons icn-search">keyboard_arrow_left</i></a></h1>';
        statusHTML += '<ul class="grid-8 main-nav">';
        statusHTML += '<li><a href=”#”>Search Results</a></li>';
        statusHTML += '<li><a href=”#”></a></li>';
        statusHTML += '</ul></div>';
        statusHTML += '<div class="grid-container" id="movieDetail">';
        statusHTML += '<div class="grid-5" id="col-1">';
        statusHTML += '<img class="desc-movie-poster" src="' + response.Poster + '">';
        statusHTML += '</div>';
        statusHTML += '<div class="grid-7" id="col-2"><h2 id="titleDetail">' + response.Title + '</h2>';
        statusHTML += '<h3 id="ratingDetail"> IMDB Rating ' + response.Rated + '</h3>';
        statusHTML += '<h3 id="plotSynopsis">Plot Synopsis</h3>';
        statusHTML += '<h3 id="plotDetail">' + response.Plot + '</h3>';
        statusHTML += '<h3 id="button-toIMDB" onclick = movieSearch.linktoIMDB('; 
        statusHTML += ')>View on IMDB</h3>';
        statusHTML += '</div></div>';
        $('body').append(statusHTML);
      });
    }, //loadDetailsReturn
      
    searchReturn: function(){ // We click the button(from the detail info) to return to the movie search results
      history.pushState(null, null, null); // We must set state to null so the detail page isn't triggered
      $('.main-header2').remove(); // Remove movie detail and clear the page except for header
      $('#movieDetail').remove();
      
      var statusHTML = '';
      statusHTML += '<div class="main-content clearfix" id="main">';
      statusHTML += '<ul id="movies"><li class="desc">';
      statusHTML += '<i class="material-icons icn-movie">movie</i>';
      statusHTML += 'Search movie titles and TV shows</li></ul></div>';
      $('body').append(statusHTML);
      
      var searchInput = '';
      searchInput = $('#search').val().toLowerCase();
      searchInput = searchInput.trim();
      var url = 'https://www.omdbapi.com/';
      var searchTitle = searchInput;
      var searchYear = $('#year').val();
      var data = {
        s: searchTitle,
        y: searchYear
      };
      
      movieSearch.dataGet(url, data);
    } //end searchReturn
  }; // end Return
}()); // end movieSearch function

movieSearch.listenSearch(); //Begin by listening for search 