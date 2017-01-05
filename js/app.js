'use strict';
console.log('log version i');
listenSearch(); 
 
function MovieObj(poster, title, year) { // Capitalize this Constructor Function
    this.poster = poster;
    this.title = title;
    this.year = year;
}

function listenSearch() {
  var searchInput = '';
  var movieObj;
  var array = [];
  $("#submit").on('click', function(e) {      // If anything is entered in search field
  e.preventDefault();
  console.log('searching');
  searchInput = $('#search').val().toLowerCase();
  searchInput = searchInput.trim();
//   $(document).ready(function(){
    console.log('log searchInput ' + searchInput);
    if (searchInput == ''){
      console.log('log searchInput equals space');
    } else {
      console.log('log searchInput did not equal space');  
      var url = 'https://www.omdbapi.com/';
      var searchTitle = searchInput;
      var searchYear = $('#year').val();
      var data = {
        s: searchTitle,
        y: searchYear
      };
      $.getJSON (url, data, function(response){
        
        var i = 0;
        $.each(response.Search, function (index, movie){ // Search is a property name of the response object
          movieObj  = new MovieObj (movie.Poster, movie.Title, movie.Year); 
          array.push(movieObj);
          if (array[i].poster.length < 10) {
            console.log('check poster length is less than 10 and movie.Title = ' + array[i].title);
          }
          else {
            array[i].poster = array[i].poster.replace(/^http:\/\//i, 'https://'); // replace poster link http with https
          }
          i += 1;
          });// end each
        console.log (array);
        checkOne(array);
      }); // end getJSON
      } // end else
    
  }); // end submit click function
} // end listenSearch

  function checkOne(array) {
    $.each(array, function(key, movie) {
      // console.log(movie);
      // console.log(movie.poster);
      // console.log(key);
      checkOnePhoto(array, key);
    });
    console.log(array);
    console.log(array[0]);
    loadPage(array);
    }
    
    function checkOnePhoto (array, key) {
      console.log(key);
      var url = array[key].poster;
      console.log('this poster url is >>>>>>> ' + url);
      $.get (url, function(){ //On an image url we do not use getJSON
      // console.log('checkPhoto get success key is >>>>>>>>>>>>>>  ' + key);
      }).fail(function() {
        // console.log('checkPhoto get fail key is <<<<<<<<<<<<<<<<<  ' + key);
        array[key].poster = "N/A";
      });
    } // end checkOnePhoto function
  
  function loadPage (array) {
    console.log ('log loadPage');
    console.log(array);
    console.log(array[0]);
    console.log(array[0].poster.length);
    console.log(array[0].title);
    console.log(array[0].poster);
    $('#submit').hide();
    $('.loading-icon').show();
    $('.desc').hide();
    var statusHTML = '';
    
    for (var i=0; i<array.length; i += 1) { 
      statusHTML += '<li>';
      statusHTML += '<div class="poster-wrap">';
      if (array[i].poster.length > 10) {
        console.log(array[i].poster.length);
        console.log('poster.length is greater than 10 and i = ' + i + 'array[i].poster = ' + array[i].poster);
        console.log(array[i].poster);
        console.log(array[i].title);
        statusHTML += '<img class="movie-poster" src="' + array[i].poster + '">';
      }else {
        console.log('log movie poster is not greater than 10 and i = ' + i + 'array[i].poster = ' + array[i].poster);
        console.log(array[i].poster);
        console.log(array[i].title);
        statusHTML += '<i class="material-icons poster-placeholder">crop_original</i>'; 
      } // end else
      statusHTML += '</div>';
      statusHTML += '<span class="movie-title">' + array[i].title + '</span>';
      statusHTML += '<span class="movie-year">' + array[i].year + '</span>';
      statusHTML += '</li>';
    }// end for
  
    
   $('#movies').html(statusHTML); 
 } // end loadPage function
  

