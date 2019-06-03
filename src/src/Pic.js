import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import * as React from 'react';

var file = new File([""], "filename");
var storageRef = firebase.storage().ref('userpics/filecurrent');
   class PicUploader extends React.Component{
      

        render()
        {
            return(
                <div>
                    <input type ="file" onChange={e =>
                     file = e.target.files[0]
                     
                     }/>
                    <button
				   onClick={() => {
                      // var file = e.target.files[0];
                     
                       storageRef.put(file).then(function(snapshot) {
                        console.log('Uploaded a file!');
                      });
		
				}}
			  >Upload Pic</button> 
                </div>
            );
        }
    }

   export {PicUploader};