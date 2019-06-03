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

function RecipeBookmarks() {
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;

		var bookmarks = firebase.database().ref("accounts/" + uid + "/bookmarks");

		bookmarks.orderByValue().on("value", function(snapshot) {
		  snapshot.forEach(function(data) {
				var recipe = firebase.database().ref("recipes/" + data.val());
				recipe.on("value", function(snapshot2)
				{
					if (snapshot2.val().title != window.undefined)
					{
					console.log(Object.values(snapshot.val()));

					var ing = snapshot2.val().ingredients;
				  var meas = snapshot2.val().measurements;
				  var stps = snapshot2.val().steps;
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
				  <h1>{ snapshot2.val().title }</h1>
					<Bookmark found={ true } uid={ uid } rid={ snapshot2 } bookmarks={ firebase.database().ref("accounts/" + uid).child("bookmarks") } keys={ Object.keys(snapshot.val()) } values={ Object.values(snapshot.val()) }/>
				  <h2>{ snapshot2.val().description }</h2>
				  <h2>Recipe by: { snapshot2.val().user }</h2>
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
				}
				});
			});
		});
	} else {
	// No user is signed in.
	}
});
}
RecipeBookmarks();

//this is the html for the login page
class IndexPage extends React.Component {
	render(){
	return (
			<div>
			<div>
			<button>
				<p onClick={() => window.location.reload()}>Refresh</p>
			</button>
			</div>
			<div>
				{ listings }
			</div>
			</div>
	)
	}
}












//heres where the website is run and rendered
//setPageOnStartup();



export default IndexPage;
