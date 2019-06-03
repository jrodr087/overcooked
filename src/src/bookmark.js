import React from 'react';
import firebase from './firebase.js';
class Bookmark extends React.Component {


  constructor(props){

    super(props);

    if (this.props.found)
    {
      this.state ={
        updated: this.props.found,
        text: "Bookmarked!"
      }
    }
    else
    {
      this.state ={
        updated: this.props.found,
        text: "Bookmark"
      }
    }
    this.updateBookmark = this.updateBookmark.bind(this);
  }

  updateBookmark() {
    if(!this.state.updated) {
      var newKey = this.props.bookmarks.push(this.props.rid.key);
      this.props.keys.push(newKey.key);
      this.props.values.push(this.props.rid.key);
      this.setState((prevState, props) => {
        return {
          updated: true,
          text: "Bookmarked!"

        };
      });
    } else {
      for (var i = 0; i < this.props.values.length; i++)
    	{
        var k = this.props.keys[i];
    		if (this.props.values[i] == this.props.rid.key)
    		{
          //console.log(this.props.keys[i] + " " + this.props.uid);
          var path = "accounts/" + [this.props.uid] + "/bookmarks/" + [this.props.keys[i]];
          console.log(path);
    			firebase.database().ref(path).remove();
    		}
    	}

      this.setState((prevState, props) => {
        return {
          updated: false,
          text: "Bookmark"
        };
      });
    }
  }

  render(){
    return(
      <button>
        <p onClick={this.updateBookmark}>{ this.state.text }</p>
      </button>
    );
  }
}

export default Bookmark;
