//To keep yourself logged in even after refreshing 
//We need to use context API
// we use react context API to store the users data in the particular part of website
//this can be achieved using stateProvider.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStateValue } from '../stateProvider';
import db, { auth } from '../firebase';
import Navbar from './Navbar';
import Post from './Post';
import { useState } from 'react';
import { async } from '@firebase/util';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
function Home() {
  
  const [{user}] = useStateValue();
  const [allPost, setAllPost] = useState([]);

  useEffect(()=>{
    const fetchPosts = () => {
      const q= query(collection(db,'posts'), orderBy("timeStamp", "desc"));
     
       onSnapshot(q,(snapshot)=> {
        setAllPost(snapshot.docs);
      });

    };
    fetchPosts();
  });
  



  return ( 
    <Container>
      <Navbar/>
      <Inner>
        <Main>
          <PostContainer >
          {
                allPost.map((post) => (
                  <Post 
                      userName={post.data().userName} 
                      photoURL={post.data().photoURL}
                      caption={post.data().caption} 
                      imageURL={post.data().imageURL}
                      postID={post.id}
                  />
                ))} 
        </PostContainer>  
        </Main>
      </Inner>
    </Container>
  );
}

const Container=styled.div``;

const Inner=styled.div`
width:100%;
margin-top: 60px;
`;

const Main=styled.main`
max-width: 935px;
margin: 20px auto;
height: 680px;
display:flex;
justify-content:space-evenly;
`;

const PostContainer= styled.div`
max-width:620px;
width: 100%;
`;
export default Home;
