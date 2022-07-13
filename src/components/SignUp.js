import React , { useState } from "react";
import styled from "styled-components";
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import db, { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


function SignUp() {
  const[email, setEmail] = useState("");
  const[userName, setUserName] = useState("");
  const[password, setPassword] = useState("");
  const[photoURL, setPhotoURL] = useState("");
  const navigate=useNavigate();
//for firebase
  const createAccount = async (e) => {
    e.preventDefault(); //to prevent refreshing
    //weather the username is present in database
    const username_query = await query(
      collection(db, "users"),
      where("userName","==",userName)
    );
      //if exist grab the document of any collection
    const username_exists = await getDocs(username_query);
    //if user does not exist
    if(username_exists.docs.length===0){
      //if all three inputs are filled up
      if(userName.length>0 && email.length>0 && password.length>0) {
        createUserWithEmailAndPassword(auth, email, password).then(
          async (userCredential) => {
            updateProfile(userCredential.user,{
            displayName: userName,
            photoURL: photoURL,  
          });
          //create document in db(referece to firestore) inside it in users collections with users.Uid  
          await setDoc(doc(db,'users', userCredential.user.uid),{
           email,
           userName,
           photoURL,
          });

          //remove each and everything from input by setting empty strings
          setEmail("");
          setPassword("");
          setPhotoURL("");
          setUserName("");
          alert("Your Account is Created");
          navigate("/login");
        })
        .catch( (err) => alert(err));
    } else {
      alert("Please fill the inputs");    
    } 
  } else {
    alert("User name Exists")
  }
};

//for firebase
  return (
    <Container>
      <Main>
        <Form onSubmit={createAccount}>
          <Logo>
              <img src="./instagram-text-logo.png" alt=""/>
          </Logo>
          <InputContainer>
              <input 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
          </InputContainer>
          <InputContainer>
              <input 
                type="text" 
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
                value={userName} 
              />
          </InputContainer>
          <InputContainer>
              <input 
                type="password" 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password} 
              />
          </InputContainer>
          <InputContainer>
              <input 
                type="text" 
                placeholder="PhotoURL(optional)" 
                onChange={(e) => setPhotoURL(e.target.value)}
                value={photoURL}
              />
          </InputContainer>

          <button onClick={createAccount}>Sign Up</button>
        
        </Form>

        <LoginContainer>
          <p>
            Have an account ? <span onClick={()=>navigate("/login")}>Log In</span>
          </p>
        </LoginContainer>
      </Main>
    </Container>
  )
}

const Container=styled.div`
  width:100vw;
  height:100vh;
  display:flex;
  align-items: center;
  justify-content: center;
`;

const Main = styled.main``;

const Form = styled.form`
  background: #fff;
  border:1px solid lightgray;
  padding: 20px;
  min-width: 300px;
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content:center;
  height:400px;
  
  button{
    height: 33px;
    width: 230px;
    background-color: #0095f6;
    border:none;
    outline: none;
    border-radius:5px;
    margin-top:30px;
    font-size:14px;
    color:#fff;
    cursor:pointer;
  }
`;

const Logo=styled.div`
  width: 250px;
  img{
    width: 100%;
  }
`;

const InputContainer=styled.div`
  height: 25px;
  width: 250px;
  margin-top: 20px;
  input{
    height: 100%;
    width: 100%;
    background-color: #fafafa;
    border: 1px solid gray;
    padding: 5px;
  }
`;

const LoginContainer =styled.div`
  border: 1px solid lightgray;
  padding:20px;
  background-color:#fff;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content:center;
  
  p{
    font-size:14px;
    span{
      color: #18a4f8;
      font-weight: 600;
      cursor:pointer;
    }
  }
`;

export default SignUp
