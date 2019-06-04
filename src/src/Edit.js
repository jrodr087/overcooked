import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './firebase.js';
import UploadRecipe from './RecipeUpload.tsx';
import updateApp from './index.js';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";

var listings = [];
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


function RecipeIndex() {        //To call out user's recipe titles
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



//this is the html for the title page
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



//Edit Content Page
class EditContentsPage extends React.Component {
    render() {
        var page;
        page =
            <div>
            <header>
                <div>
                    <button>
                        <p onClick={() => window.location.reload()}>Refresh</p>
                    </button>
                </div>
                <h1>
                    Edit Content Page
                </h1>
                <h2>
                    Title:
                    <input type="text" name="textbox1" id="textbox1" placeholder={dataVal.val().title} />
                </h2>
                <h3>
                    Description:
                    <input type="text" name="textbox2" id="textbox2" placeholder={dataVal.val().description} />
                </h3>
                <h4>
                    Ingredients and Measurements:
                </h4>
                <h5>
                    <input type="text" name="textbox3" id="textbox3" placeholder={dataVal.val().ingredients[0]} />
                    <input type="text" name="textbox4" id="textbox4" placeholder={dataVal.val().measurements[0]} />
                </h5>
                <h6>
                    <input type="text" name="textbox5" id="textbox5" placeholder={dataVal.val().ingredients[1]} />
                    <input type="text" name="textbox6" id="textbox6" placeholder={dataVal.val().measurements[1]} />
                </h6>
                <h7>
                    <input type="text" name="textbox7" id="textbox7" placeholder={dataVal.val().ingredients[2]} />
                    <input type="text" name="textbox8" id="textbox8" placeholder={dataVal.val().measurements[2]} />
                </h7>
                <br></br>
                <br></br>
                <h8>
                    Steps:
                </h8>
                <br></br>
                <h9>
                    <input type="text" name="textbox9" id="textbox9" placeholder={dataVal.val().steps[0]} size = "50" />
                </h9>
                <br></br>
                <h10>
                    <input type="text" name="textbox10" id="textbox10" placeholder={dataVal.val().steps[1]} size="50" />
                </h10>
                <br></br>
                <h11>
                    <input type="text" name="textbox11" id="textbox11" placeholder={dataVal.val().steps[2]} size="50" />
                </h11>
                <br></br>
                    <button>
                    <p onClick={() => updateContent(document.getElementById("textbox1").value,
                                                    document.getElementById("textbox2").value,
                                                    document.getElementById("textbox3").value,
                                                    document.getElementById("textbox4").value,
                                                    document.getElementById("textbox5").value,
                                                    document.getElementById("textbox6").value,
                                                    document.getElementById("textbox7").value,
                                                    document.getElementById("textbox8").value,
                                                    document.getElementById("textbox9").value,
                                                    document.getElementById("textbox10").value,
                                                    document.getElementById("textbox11").value)}>Edit</p>
                    </button>
                </header>
        </div>
        return page;
    }
}

//Update function
function updateContent(val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11) {
    var ingredients = [val3, val5, val7];
    var measurements = [val4, val6, val8];
    var steps = [val9, val10, val11];
    var newContent = {
        title: val1,
        description: val2,
        ingredients: ingredients,
        measurements: measurements,
        steps: steps
    };

    
    var result = firebase.database().ref().child('/recipes/' + dataVal.key).update(newContent);
    return result
}



//transition functions
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