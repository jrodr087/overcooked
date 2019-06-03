import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './firebase.js';
//import UploadRecipe from './RecipeUpload.tsx';
import updateApp from './index.js';
import Bookmark from './bookmark.js';
var listings = [];
var searchval = "";
var error = "";
var spaceregex = / +/;
var quoteregex = /"([^"]*)"/g;
var curpage;
var bmFound;
var uid;
var searchstrictness = false;
firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		uid = user.uid;
	  }
	  else{
		  uid = 0;
	  }
});
function GetBookmarks(bm, d)
{
	var i;
	bmFound = false;
	var values = Object.values(bm.val().bookmarks);
	var keys = Object.keys(bm.val().bookmarks);
	for (i = 0; i < values.length; i++)
	{
		if (values[i] == d.key)
		{
			bmFound = true;
		}
	}
}
function SanitizeEmptyStrings(vals){// i really dont know how they get in there sometimes
	var i;
	for (i = 0; i < vals.length; i++){
		if (vals[i] == ""){
			vals.splice(i,1);
			i -= 1;
		}
	}
	console.log(vals);
	return vals;
}
function FoundInput(data, vals){
	var foundflag = false;
	var k;
	var strictsearch = true;
    vals.forEach(function(temp) {
		var strictcheck = false;
		var val = new RegExp(temp,"i");
		var title = data.val().title;
		var description = data.val().description;
		var user = data.val().user;
		if (val.test(title) == true){
			strictcheck = true;
		}
		if (val.test(description) == true){
			strictcheck = true;
		}
		if (val.test(user) == true){
			strictcheck = true;
		}
		var ing = data.val().ingredients;
		var i;
		for (i = 0; i < ing.length; i++){
		  if (val.test(ing[i]) == true){
			  strictcheck = true;
		  }
		}
		if (strictcheck){
			foundflag = true;
		}
		else{
			strictsearch = false;
		}
	});
	if (searchstrictness){
		return strictsearch;
	}
	else{
		return foundflag;
	}
}
function handleReturnToSearchInput(){
	error = "";
	searchval = "";
	searchstrictness = false;
	curpage = <InputSearchPage/>;
	updateApp();
}
function ParseSearchInput(){
	listings.length = 0;
	var quotes = searchval.match(quoteregex); // gets every search term between quotes
	var searchValues = [];
	if (quotes !== null){
		for (var quotein = 0; quotein < quotes.length; quotein++){
			quotes[quotein] = quotes[quotein].replace(/"/g,""); // removes the quotes from the strings
		}
	}
	searchval = searchval.replace(quoteregex,""); // removes the quotes from the search string
	console.log(searchval);
	if (searchval !== ""){
		searchValues = searchval.split(spaceregex); // gets any terms separated by spaces
	}
	if (quotes !== null){
		searchValues = searchValues.concat(quotes);
	}
	console.log(searchValues);
	return SanitizeEmptyStrings(searchValues);
}
function RecipeSearch() {
	
	var searchValues = ParseSearchInput();
	//var ref = firebase.database().ref("recipes");
  if (uid) {
	var i;
	listings.length = 0;
		var recipe = firebase.database().ref("recipes");
		recipe.orderByValue().on("value", function(snapshot) {
		  snapshot.forEach(function(data) {
			  var testflag = FoundInput(data, searchValues);
			  if (testflag == false){
			  }
			  else{
				var bookmark = firebase.database().ref("accounts/" + uid);
				bookmark.on("value", function(snapshot)
				{
					GetBookmarks(snapshot, data);
					var ing = data.val().ingredients;
				  var meas = data.val().measurements;
				  var stps = data.val().steps;
					var ingList = [];
					var stepsList = [];

				  for (i = 0; i < ing.length; i++){
					  //listing = listing + "<li>" + ing[i] + ", " + meas[i] + "</li>";
						ingList.push(<li>{ing[i]}, {meas[i]}</li>);
				  }
					for (i = 0; i < stps.length; i++){
					  //listing = listing + "<li>" + stps[i] + "</li>";
						stepsList.push(<li>{stps[i]}</li>);
				  }
				  var listing =
					(
					<div>
				  <h1>{ data.val().title }</h1>
					<Bookmark found={ bmFound } uid={ uid } rid={ data } bookmarks={ firebase.database().ref("accounts/" + uid).child("bookmarks") } keys={ Object.keys(snapshot.val().bookmarks) } values={ Object.values(snapshot.val().bookmarks) }/>
				  <h2>{ data.val().description }</h2>
				  <h2>Recipe by: { data.val().user }</h2>
					<h3>Ingredients</h3>
				  <ol>
					{ingList}
				  </ol>
				  <h3>Steps</h3>
					<ol>
					{stepsList}
				  </ol>
					</div>
					)
				listings.push(listing);
			  });
			}
			});
		});
		/*if (listings.length == 0){
			var listing = "<div><h1><p>No results found</p></h1></div>";
			listings.push(listing);
		}*/
	} else {
		listings.length = 0;
		var listing = <div><h1><p>Login before searching.</p></h1></div>;
		listings.push(listing);
	// No user is signed in.
	}
}


//this is the html for the login page
class SearchPage extends React.Component {
	render(){
	var page;
	page =
	<div>
	<div>
		<h4>
			<p>Return to search?.</p>
			<input type="submit" value="Return" onClick={handleReturnToSearchInput}/>
		</h4>
	</div>
	<div>{ listings }</div>
	</div>
	return page;
	}
}
function StartSearch(){
	RecipeSearch();
	curpage = <SearchPage/>;
	updateApp();
}
function handleSearchEvent(event){
		if (searchval == ""){
			error = "Please input a value for the search";
		curpage = <InputSearchPage/>;
		 updateApp();
		 }
		else{StartSearch();}
}
function handleChangeSearch(event){
	searchval = event.target.value;
}
function handleChangeStrictness(event){
	searchstrictness = event.target.value;
}
class InputSearchPage extends React.Component {
	
	render(){
	var page;
	page =
	<div>
		<h1>
			<p>Please input your search terms:</p>
		</h1>
		<h2>
			<input type="text" name="term" onChange={handleChangeSearch}/>
		</h2>
			<input type="checkbox" name="termstrictness" onChange={handleChangeStrictness}/>Require every term to be found in order for a recipe to show in results?
		<h3>
			<p>{error}</p>
		</h3>
		<h4>
			<p>Search terms are separated by spaces. Any recipe containing any term will be returned, unless the above textbox is checked. Then a recipe <i>must contain</i> each term in order to be indexed.</p>
			<p>Surround a search term in quotes to search for an exact term.</p>
			<p>Example: Searching <i>peanut butter</i> will return recipes using peanuts or butter.</p>
			<p>Searching <i>"peanut butter"</i> will return recipes using peanut butter.</p>
			<p>The term is searched for in the recipe title, description, uploader's username, and ingredients.</p>
			<input type="submit" value="search" onClick={handleSearchEvent}/>
		</h4>
	</div>
	return page;
	}
}
curpage = <InputSearchPage/>;

function Search(){
	return curpage;
}









export default Search;