import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import db, { auth } from '../firebase';
import { useStateValue } from '../stateProvider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

function Navbar() {
  const [{ user }, dispatch] = useStateValue();
  const [ openMenu, setOpenMenu ] = useState(false); 
  const [ openDialog, setOpenDialog] = useState(false);
  const [ imageURL, setImageURL] = useState("");
  const [ caption, setCaption] = useState("");
  
  const navigate=useNavigate();
  const logOut = (e) => {
    signOut(auth)
      .then(()=>{
        localStorage.removeItem('user');
        dispatch({
          type:"SET_USER",
          user:null,
        });
        navigate("/login");
    })
    .catch(err=>alert(err));
  };

  const createPost = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'posts'), {
      caption,
      imageURL,
      userName:user?.userName,
      photoURL: user?.photoURL === null ? "./user.png": user?.photoURL,
      timeStamp: serverTimestamp(),
    });
    
    alert("Post created");
    setCaption("");
    setImageURL("");
    setOpenDialog(false);
  };

  return (
    <Container>
      <Dialog 
          open={openDialog} 
          onClose={()=>setOpenDialog(false)} 
          maxwidth='xl' 
          fullWidth
      >
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <CreatePostForm>
            <InputContainer>
              < input 
                type="text" 
                placeholder='ImageURL' 
                value={imageURL} 
                onChange = {  (e) => setImageURL(e.target.value)}
              />
            </InputContainer>
            <InputContainer>
              <textarea 
                type="text" 
                placeholder='caption'
                value={caption} 
                onChange = {  (e) => setCaption(e.target.value)}
              
              />
            </InputContainer>
          </CreatePostForm>
        </DialogContent>
        
        <DialogActions>
          <PostCTAButtons>
            <button className='cancel-button' onClick={()=>setOpenDialog(false)}>Cancel</button>
            <button className='post-button' onClick={createPost}>Post</button>
          </PostCTAButtons>
        </DialogActions>
      
      </Dialog>
      <Logo>
        <img src="./logo.png" alt=""/>
      </Logo>
      <SearchBar>
        <input type="text" placeholder="Search ..."/> 
      </SearchBar>
      <Icons>
        <Icon><img src="./41-home.svg" alt="" onClick={() => navigate("/")}/></Icon>
        <Icon><img src="./40-add-card.svg" alt="" onClick={()=> setOpenDialog(true)}/></Icon>
        <Icon><img src="./47-chat (1).svg" alt=""/></Icon>
        
        <Icon>
          <img 
            src={user?.photoURL===null ? './user.png':user?.photoURL}  
            alt=""
            onClick={() => setOpenMenu(!openMenu)}
          />
          <Menu openMenu = {openMenu}>
            <MenuElement onClick={() => navigate('/profile')}>Profile</MenuElement> 
            <MenuElement onClick={logOut}>Logout</MenuElement>  
          </Menu>
        </Icon>
      </Icons>
    </Container>
  );
}

const Container=styled.div`
  height: 60px;
  padding-top:5px;
  display:flex;
  flex-direction:center;
  justify-content:space-evenly;

  border-bottom: 1px solid lightgray;
  background-color:#fff;
  position:fixed;
  top: 0;
  width: 100%;
  z-index:100;
  
  @media only screen and (max-width: 768px){
    justify-content: space-around;
  }
`;

const Logo=styled.div`
  cursor: pointer;
`;

const SearchBar=styled.div`
height: 30px;
width: 268px;
padding: 3px 16px 3px 16px;
min-height: auto;
min-width:auto;
background-color: #efefef;
border-radius:10px;
display: flex;
align-item:center; 

input{
  background-color: transparent;
  border:none;
  outline: none;
  line-height:18px;
  font-size:14px;
  width:90%;
}

@media only screen and (max-width: 768px){
  display:none;
}
`;


const Icons=styled.div`
  display: flex;
  align-items: center;
  width: 180px;
  justify-content: space-evenly;
  height:40px; 
`;

const Icon=styled.div`
width:35px;
height:35px;
cursor:pointer;
img{
  width: 25px;
  height: 25px;
}

&:nth-child(4){
  img{
    border-radius: 50%;
  }
  position:relative;
}
`;

const Menu=styled.div`
  position: relative;
  bottom: -8px;
  display: ${(props) => (props.openMenu ? "Block":"None")};
  
  background: #fff;
  width: 100px;
  border: 1px solid lightgray;
  border-radius:5px;

`;

const MenuElement=styled.div`
  height:20px;
  color:gray;
  border-bottom: 1px solid lightgray;
  padding:10px;
  &:hover{
    background-color: lightgray;
  }
`;

const CreatePostForm=styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  align-items: center;
  height:350px;
`;

const InputContainer=styled.div`
  width:90%;
  height: 33px;
  margin-bottom:20px;
  
  input{
    width: 100%;
    height: 100%;
    border: 1px solid lightgray;
    padding: 5px;
    outline: none;
  }

  textarea{
    width: 100%;
    height: 200px;
    resize: none;
    border: 1px solid lightgray;
    padding: 5px;
    outline: none;
  }
`;

const PostCTAButtons = styled.div`
  button{
    width: 100px;
    height: 33px;
    margin-right:10px;
    cursor:pointer;
    border:none;
    outline:none;
    color:#fff;
    border-radius:5px;
  }

  .cancel-button{
    background-color:red;
    border-radius:5px;
  }

  .post-button{
    background-color: #18a4f8;
    border-radius:5px;
  }

`;

export default Navbar;
