import { produce } from "immer";
import React, { useState } from "react";
import { generate } from "shortid";
import TextForm, { title } from './title.js';
import DescriptionForm, { description } from './description.js';
import firebase from './firebase.js';
import { PicUploader } from "./Pic.js";
var userEmail = "";

interface IngredientList {
  id: string;
  Ingredient: string;
  Measurement: string;
}
interface StepList {
  id: string;
  Step: string;
}
const UploadRecipe = () => {
	var	user = firebase.auth().currentUser;

	firebase.auth().onAuthStateChanged(function(user) {
		user = firebase.auth().currentUser;
		if (user){
			if (typeof user.email === "string"){
				userEmail = user.email;
			}
		}
	});
  var errorMessage = "";
  const [IngredientList, setIngredientList] = useState<IngredientList[]>([
    { id: generate(), Ingredient: "Ingredient", Measurement: "Measurement"}
  ]);
  const [StepList, setStepList] = useState<StepList[]>([
    { id: generate(), Step: "Steps"}
  ]);
  
  
	function writeUserData() {
		var i;
		var tempsteplist = [];
		var tempinglist = [];
		var tempmeaslist = [];
		for (i = 0; i < IngredientList.length; i++) {
		  if (IngredientList[i].Ingredient === ""){
			  errorMessage = "Ingredient fields cannot be blank";
			  return;
		  }
		  tempinglist.push(IngredientList[i].Ingredient);
		  if (IngredientList[i].Measurement === ""){
			  errorMessage = "Measurement fields cannot be blank";
			  return;
		  }
		  tempmeaslist.push(IngredientList[i].Measurement);
		} 
		for (i = 0; i < StepList.length; i++) {
		  if (StepList[i].Step === ""){
			  errorMessage = "Step fields cannot be blank";
			  return;
		  }
		  tempsteplist.push(StepList[i].Step);
		} 
		if (title === ""){
		  errorMessage = "Title field cannot be blank";
		  return;
		}
		if (description === ""){
		  errorMessage = "Description field cannot be blank";
		  return;
		}
		console.log(title);
		console.log(description);
		console.log(JSON.stringify(StepList));
		console.log(JSON.stringify(IngredientList));
		firebase.database().ref('recipes/' + generate()).set({
		  title: title,
		  description: description,
		  steps: tempsteplist,
		  user: userEmail,
		  ingredients: tempinglist,
		  measurements: tempmeaslist
		});
	}


	if (user){
	  return (
			<div style={{ textAlign: "center" }}>
				<TextForm />
				<button
					onClick={() => {
					  console.log({ title });
					}}
				> log title</button>
				<DescriptionForm />
				<button
					onClick={() => {
					  console.log({ description });
					}}
				>log description</button>
       <br></br>
				{/* Add image */}
				<PicUploader/>
				
				{/* <button
				   onClick={() => {
				  setIngredientList(currentIngredientList => [
					...currentIngredientList,
					{
					  id: generate(),
					  Ingredient: "",
					  Measurement: "",
					}
				  ]);
				}}
			  >Add Ingredient</button> */}
				
			  
			  {IngredientList.map((ing, index) => {
				return (
				  <div key={ing.id}>
					<input
					  onChange={e => {
						const Ingredient = e.target.value;
						setIngredientList(currentIngredientList =>
						  produce(currentIngredientList, v => {
							v[index].Ingredient = Ingredient;
						  })
						);
					  }}
					  value={ing.Ingredient}
					  placeholder="Ingredient"
					/>
					<input
					  onChange={e => {
						const Measurement = e.target.value;
						setIngredientList(currentIngredientList =>
						  produce(currentIngredientList, v => {
							v[index].Measurement = Measurement;
						  })
						);
					  }}
					  value={ing.Measurement}
					  placeholder="Measurement"
					/>

				<button
				   onClick={() => {
				  setIngredientList(currentIngredientList => [
					...currentIngredientList,
					{
					  id: generate(),
					  Ingredient: "",
					  Measurement: "",
					}
				  ]);
				}}
			  >Add Ingredient</button> 

					<button
					  onClick={() => {
						setIngredientList(currentIngredientList =>
						  currentIngredientList.filter(x => x.id !== ing.id)
						);
					  }}
					>
					  
					</button>
				  </div>
				);
			  })}
				{/* <button
					onClick={() => {
					  console.log({ title });
					}}
				>
					log title
				</button> */}
			{/* 	<button
					onClick={() => {
					  console.log({ description });
					}}
				>
					log description
				</button> */}
			   {/* <div>{JSON.stringify(IngredientList, null, 2)}</div>  */}

			  

			  {/* <button
				onClick={() => {
				  setStepList(currentStepList => [
					...currentStepList,
					{
					  id: generate(),
					  Step: "",
					}
				  ]);
				}}
			  >
				add new Step
				</button> */}
			<br></br>
			
			  {StepList.map((ing, index) => {
				return (
				  <div key={ing.id}>
					<input
					  onChange={e => {
						const Step = e.target.value;
						setStepList(currentStepList =>
						  produce(currentStepList, v => {
							v[index].Step = Step;
						  })
						);
					  }}
					  value={ing.Step}
					  placeholder="Steps"
					/>
					<button
				onClick={() => {
				  setStepList(currentStepList => [
					...currentStepList,
					{
					  id: generate(),
					  Step: "",
					}
				  ]);
				}}
			  >
				add new Step
			  </button>

					<button
					  onClick={() => {
						setStepList(currentStepList =>
						  currentStepList.filter(x => x.id !== ing.id)
						);
					  }}
					>
				  
					</button>
				  </div>
				);
			  })}
			  <div>
					<button onClick={writeUserData}>
				  upload recipe
					</button>
				</div>
			    {/* <div>{JSON.stringify(StepList, null, 2)}</div>  */}
			
			  <div>
				<p>{errorMessage}</p>
			  </div>
			</div>
		  );
	
	}
	else{
		return(
		<div>
		<h1>please log in first</h1>
		</div>
		);
	}
};


export default UploadRecipe;