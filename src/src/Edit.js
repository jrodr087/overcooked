import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './firebase.js';
import UploadRecipe from './RecipeUpload.tsx';
import updateApp from './index.js';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";

var listings = [];
var dataVal = [];
var userEmail = "";
var currPage;
var dataVal;

var user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function (user) {
    user = firebase.auth().currentUser;
    if (user) {
        if (typeof user.email === "string") {
            userEmail = user.email;
        }
    }
});


function RecipeIndex() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            listings.length = 0;
            var recipe = firebase.database().ref("recipes");

            recipe.orderByValue().on("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    if (userEmail == data.val().user) {
                            var listing =
                                (
                                    <div>
                                        {data.val().title}
                                        <button>
                                            <p onClick={() => ChangeToEditContentsPage(data)}>Edit</p>
                                        </button>
                                    </div>
                                )
                            listings.push(listing);
                    }
                });
            });
        } else {
            // No user is signed in.
        }
    });
}
RecipeIndex();



//this is the html for the login page
class TitlePage extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <button>
                        <p onClick={() => window.location.reload()}>Refresh</p>
                    </button>
                </div>
                <div>
                    {listings}
                </div>
            </div>
        )
    }
}

class EditContentsPage extends React.Component {
    render() {
        var page;
        page =
            <div>
                <header>
                <h1>
                    Edit Content Page
                </h1>
                <h2>
                    {dataVal.val().ingredients}
                    {firebase.database().ref().child('/recipes/' + dataVal.key).update({ ingredients: "Samething"})}
                    {dataVal.val().ingredients}
                </h2>
                </header>
            </div>
        return page;
    }
}

function updateContent(description, ingredients, step) {

    var newContent = {
        ingredients: ingredients,
        steps: step
    };

    var newPostKey = firebase.database().ref().child('recipes').push().key;

    var updates = {};
    //updates['/recipes/' + dataVal.key] = newContent;

    //return firebase.database().ref().update(updates);
    var result = firebase.database().ref().child('/recipes/' + dataVal.key).update(newContent);
    return result
}





///transition functions
function ChangeToEditContentsPage(data) {
    currPage = <EditContentsPage />;
    dataVal = data;
    updateApp();
}


function Edit() {
    return (
        currPage
    );
}

function register() {
    currPage = <EditContentsPage />;
    updateApp();
}


currPage = <TitlePage />;

//heres where the website is run and rendered
//setPageOnStartup();



export default Edit;