import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import {storage, db} from './firebase';
import firebase from 'firebase';
import "./UploadPost.css";


function UploadPost({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState(''); 
    
    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    }

    const handleUpload = () => {
         const uploadTask = storage.ref(`images/${image.name}`).put(image);

         uploadTask.on(
             "state_changed",
             (snapshot) => {
                 //progress function...
                 const progress = Math.round(
                     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                 );
                 setProgress(progress);
             },
             (error) => {
                 console.log(error.message);
             },
             () => {
                 //Complete Function...
                 storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
             }
         )
    }
    return (
        <div className="postUpload__box">
            <div className="main">
                <progress value={ progress } max="100" id="progress" />
                <input type="text" placeholder="Enter a caption..." onChange={(event) => setCaption(event.target.value)} value={ caption } />            
                <input type="file" onChange={ handleChange } />
                <button onClick={ handleUpload } className="Button">Upload</button>
            </div>
        </div>
    )
}

export default UploadPost
