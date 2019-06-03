import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './firebase.js';
import UploadRecipe from './RecipeUpload.tsx';
import updateApp from './index.js';
import Bookmark from './bookmark.js';
var listings = [];
var uid;
var i;
var bmFound;

function GetBookmarks(bm, d)
{
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

function RecipeIndex() {
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
	listings.length = 0;


		var recipe = firebase.database().ref("recipes");

		recipe.orderByValue().on("value", function(snapshot) {
		  snapshot.forEach(function(data) {
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
			});
		});
	} else {
	// No user is signed in.
	}
	});
}
RecipeIndex();

//this is the html for the login page
class IndexPage extends React.Component {
	render(){
	return <div>{ listings }</div>
	}
}












//heres where the website is run and rendered
//setPageOnStartup();



export default IndexPage;
