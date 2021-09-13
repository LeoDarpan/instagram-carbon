import React, { useState, useEffect } from 'react';
import './App.css';
import logo from "./instagram-text.png";
import logo1 from "./Carbon-Logo-For-Site-v2.png";
import Post from './Post';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import UploadPost from './UploadPost';
import LoginToUpload from './LoginToUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  
  //This gets fired on every authentication action, like on every login or logout et cetera
  useEffect(() => {
    //login listener
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //User has logged in...
        console.log(authUser);
        setUser(authUser);
      }else{
        //User has logged out...
        setUser(null);
      }
    })

    return () => {
      //Perform Cleanup actions
      unsubscribe();
    }
  }, [user, username])

  //useEffect
  useEffect(() => {
    //Everytime a new post is added, this code runs
    db.collection('posts').orderBy("timestamp", 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})));  
    });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        alert("Sign up successful!");
        setOpen(false);
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        alert("Login successful!");
        setOpenSignIn(false);
      })
      .catch((error) => alert(error.message));
  }

  return (
    <div className="app">
        {/* -------Sign Up Modal-------*/}
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form action="" className="app__signup">
              <center>
                <img src={ logo } className="app__headerImage"/>
              </center>
                <Input placeholder="username" type="text" value={username} onChange = {(event) => setUsername(event.target.value)}/>
                <Input placeholder="email" type="text" value={email} onChange = {(event) => setEmail(event.target.value)}/>
                <Input placeholder="password" type="password" value={password} onChange = {(event) => setPassword(event.target.value)}/>
                <Button onClick = { signUp }>Sign Up</Button>
              </form>
          </div>
        </Modal>

        {/* Signin Modal */}
        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form action="" className="app__signup">
              <center>
                <img src={ logo } className="app__headerImage"/>
              </center>
                <Input placeholder="email" type="text" value={email} onChange = {(event) => setEmail(event.target.value)}/>
                <Input placeholder="password" type="password" value={password} onChange = {(event) => setPassword(event.target.value)}/>
                <Button onClick = { signIn }>Sign In</Button>
              </form>
          </div>
        </Modal>
        
       {/* ---------Header--------- */}
        <div className="app__header">
          <div className="logos">
            <img className="app__headerImage" src= { logo } alt="Instagram Logo"/>
            <div className="logo__text">Carbon</div>
          </div>
          
          {/* Login/SignUp Button */} 
          {
            user?.displayName ? (
              //Render Logout button if user is logged in
              <div className="app__userCorner">
                <div className="app__usernameShow">Welcome <span className="user__font">{ user.displayName }!</span></div>
                <Button onClick= { () => auth.signOut() } className="logout__button"> Logout </Button>
              </div>
            ): (
              //Render Signup/SingIn button if user is new
              <div className="app__loginContainer">
                <Button onClick= { () => setOpenSignIn(true) } className="signin__button"> Sign In </Button> /
                <Button onClick= { () => setOpen(true) } className="signin__button"> Sign Up </Button>
              </div>
            )
          }   
       </div>
      
      {/* ---------Posts---------- */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              user?.displayName ? (
            <Post key={id} postId = {id} username={post.username} caption={post.caption} user={ user } imageUrl={post.imageUrl} />
            ): (
              <Post key={id} postId = {id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            )))
          }
        </div> 
        <div className="app__postsRight">
        {/* <InstagramEmbed
          url='https://www.instagram.com/p/CNYz8kQBfKH/?utm_medium=copy_link'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        /> */}
        </div> 
      </div>
      {/* Upload Post Component */}
        {/* Loaded with a Caption Input, File Picker, Progress Bar and Post Button */}
        {
          user?.displayName ? (
            //Render upload module only when user is logged in!
            <UploadPost username={ user.displayName }/>
          ): (
            <LoginToUpload />
          )
        }
      
    </div>  
  )
}

export default App;
