import React, { useState, useEffect } from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import {db} from "./firebase";
import firebase from "firebase";

function Post({ username, caption, imageUrl, postId, user }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()))
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        if(!user){
            alert("Please login to comment!");
        }else{
            db.collection("posts").doc(postId).collection("comments").add({
                comment: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setComment("");
        }
    }

    return (
        <div className="post">
            {/* header -> avatar + username */}
            <div className="post__header">
                <Avatar className="post__avatar" src="https://m.media-amazon.com/images/I/41jLBhDISxL._SY355_.jpg"/>
                <h3>{ username }</h3>
            </div>

            {/* image */}
            <img className="post__image" src={ imageUrl } alt="User Image" />
            
            {/* username + caption */}
            <p className="post__text"> <strong> @{ username } </strong> { caption }</p>

            {/* show comments */}
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>@{comment.username}</strong> &nbsp; {comment.comment}
                        </p>
                    ))
                }
            </div>

            {/* comment section */}
            <form className="post__commentBox">
                <input type="text" placeholder="Add a comment..." className="post__input" value={ comment } onChange = {(e) => setComment(e.target.value)}/>
                <button className="post__comment" disabled={!comment} type="submit" onClick={postComment}>Post</button>
            </form>

        </div>
    )
}
        
export default Post
