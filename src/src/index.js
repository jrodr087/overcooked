import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import UploadRecipe from './RecipeUpload.tsx'
import RecipeIndex from './RecipeIndex.js'
import RecipeBookmarks from './RecipeBookmarks.js'
import Search from './RecipeSearch.js'

class Main extends React.Component {
	render(){
		return(
		<Router>
		<div>
			<h1>Overcooked</h1>
			<ul className = "header">
				<li><Link to="/">Login</Link></li>
				<li><Link to="/recipeUpload">Upload a Recipe</Link></li>
				<li><Link to="/recipeIndex">Recipe index</Link></li>
				<li><Link to="/recipeBookmarks">Bookmarked recipes</Link></li>
				<li><Link to="/recipeSearch">Recipe search</Link></li>
			  </ul>
			  <div className="content">
			  <Route path="/" exact component={App}/>
				<Route path="/recipeUpload" component={UploadRecipe}/>
				<Route path="/recipeIndex" component={RecipeIndex}/>
				<Route path="/recipeBookmarks" component={RecipeBookmarks}/>
				<Route path="/recipeSearch" component={Search}/>
			  </div>
		</div>
		</Router>
		);
	}
}

function updateApp(){
	ReactDOM.render(<Main/>, document.getElementById('root'));
}




//function updateApp(torender){
//	ReactDOM.render(torender, document.getElementById('root'));
//}
//updateApp();
//export default updateApp;
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
export default updateApp;
