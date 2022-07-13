import React,{ useState } from 'react';
import styled from 'styled-components';
import { useStateValue } from '../stateProvider';
import db from '../firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function Post({ userName, photoURL, caption, imageURL, postID}) {
    const[moreButton,setMoreButton] = useState(false);
    const[{ user }] = useStateValue();
     
    const[likesOnPost, setLikesOnPost] = useState({
        //use state for user who likes on post inside likes array we will store the username who liked the post
        likes: []
    });

    //use state for the post whether it is liked or not
    const[likeState, setLikeState] = useState({
        like: likesOnPost?.likes.length > 0 ? likesOnPost?.likes.length: 0,
        likeActive: false,
    });

    const [commentsOnPost, setCommentsOnPost] = useState([]);

    const [commentState, setCommentState] = useState({
        comments: commentsOnPost?.length > 0 ? commentsOnPost?.length : 0,
    });



    const [commentInput,setCommentInput] = useState("");
    
    const [openDialog, setOpenDialog]= useState(false);
    
    const handleLike= async (e) => {
        e.preventDefault();
        if(likesOnPost?.likes.includes(user?.userName)){
            //dislike part
            
            //remove current user name from like array
            const likePayload={
                likes:likesOnPost?.likes.filter((likedUser)=>{
                    return likedUser!==user?.userName;
                }),
            };

            //update the database
            await setDoc(doc(db,'likes',postID), likePayload)
            //update state
            setLikesOnPost({
                likes: likePayload.likes,
            });
        }
        else
        {
            //likes
            const likePayload = {
                likes:[...likesOnPost.likes, user?.userName], 
            };

            setLikesOnPost(likePayload);
            await setDoc(doc(db,"likes",postID), likePayload);

            setLikesOnPost({
                    likes:likePayload.likes,
            });
        }
    };

    const getLikes = async ()=>{
        const docRef = doc(db,'likes',postID);
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            setLikesOnPost(docSnap.data());
        }
        
        setLikeState({
          like:docSnap.data()?.likes?.length ? docSnap.data()?.likes?.length : 0, 
          likeActive: docSnap.data().likes?.includes(user?.userName) ? true : false,        
        });
    };

    useEffect( () => {
            getLikes();
        },[likeState]);

    const handleComment = async (e) =>{
        e.preventDefault();
        
        if(commentInput.length > 0){
            let payload = {
                commentInput,
                userName:user?.userName,
                photoURL:user?.photoURL,
                timeStamp: serverTimestamp(),
            };
            const docRef = doc(db, "comments", postID);
            addDoc(collection(docRef,"list"), payload);
            
            setCommentInput("");
        }else{
            alert("please fill up the form");
        }
    };

    const getComments = async () =>{
        
        const q = query(
            collection(db,"comments", postID,"list"),
            orderBy("timeStamp", 'desc')
        );
        onSnapshot(q, (snapshot) => {
            setCommentsOnPost(snapshot.docs);
            setCommentState({
                    comments: snapshot.docs.length,
            });
        });     
    };

    useEffect(() => {
        getComments();
        
    },[commentState]);


    return (
    <Container>
        <Dialog 
         open = {openDialog} 
         onClose={()=>setOpenDialog(false)}
         maxwidth='xl' 
         fullWidth 
        >
            <DialogTitle>comments</DialogTitle>
            <DialogContent>
                <AllCommentsContainer>
                {
                    commentsOnPost.map((comment)=> (
                        <div className='post-comment'>
                            <div className='user-image'>
                                <img src={comment.data().photoURL} alt=""/>
                            </div>  
                            <div className='user-comment'>
                               <strong>{comment?.data().userName}</strong>
                               <p>{comment.data().commentInput}</p> 
                            </div>  
                        </div>
                    ))
                }
                </AllCommentsContainer>
            </DialogContent>
        </Dialog>
        <UserInfo>
            <img src={photoURL} alt=""/>
            <p>{userName}</p>
        </UserInfo>
        <Content>
            <img src={imageURL} alt=""/>
        </Content>
        <PostCTA>
            <CTAButtons>
                {
                    likeState.likeActive=== true ? (
                        <img src="./heart (1).png" alt="" onClick={handleLike} />
                    ) :  (<img src="./heart.png" alt="" onClick={handleLike}/>)
                }    
                <img src="./chat 1.png" alt="" onClick={()=>setOpenDialog(true)}/>
            </CTAButtons>
            <LikedCount>
                <p>{likesOnPost?.likes.length} likes</p>
            </LikedCount>
            <PostDescription moreButton={!moreButton}>
                <h5>{caption}</h5>
                <div className="recent-comment">
                    <strong>{commentsOnPost[0]?.data().userName}</strong>
                    <p>{commentsOnPost[0]?.data().commentInput}</p>
                </div>
                
                <div class="description-buttons">
                    <p onClick={() => setOpenDialog(true)}>view all comments</p>
                    <p onClick={()=>setMoreButton(!moreButton)}>
                        {moreButton ? "less": "more"}
                    </p>
                </div>
            
            </PostDescription> 
            <CommentInput>
                <input 
                    type="text" 
                    placeholder="Add Comment" 
                    onChange={e => setCommentInput(e.target.value)}
                    value={ commentInput }
                    />
                <button onClick={ handleComment }>Post</button>
            </CommentInput>  
        </PostCTA>
    </Container>
  );
}

const Container= styled.div`
    height: fit-content;
    width:100%;
    border:1px solid lightgray;
    background-color:#fff;
    margin-top:20px;
`;
const UserInfo= styled.div`
    height: 60px;
    padding:5px 10px;
    display:flex;
    align-items: center;

    border-bottom: 1px solid lightgray;
    img{
        width:38px;
        height:38px;
        border-radius:100%;
        margin-left: 10px;
        border:1px solid lightgray;
    }
    p{
        font-size:14px;
        line-height:10px;
        font-weight:600;
        margin-left:10px;
    }
`;
const Content= styled.div`
width:100%;
display:flex;
border-bottom:1px solid lightgray;
img{
    width:100%;
}
`;
const PostCTA = styled.div`
width: 90%;
margin:auto;
`;
const CTAButtons = styled.div`
height:54px;
display:flex;
align-items:center;

img{
    width:22px;
    height:22px;
    margin-right:10px;
    cursor:pointer;
}
`;

const LikedCount = styled.div`
    p{
       font-size:15px;
       font-weight:600;
       margin-bottom:10px; 
    }
`;

const PostDescription = styled.div`
    display: flex;
    flex-direction:column;
    width: 100%;
    h5{
       font-size:14px;
       line-weight:20px;
       border:none;
       width:100%;
       height:${(props) => props.moreButton? 'fit-content':'40px'};
       overflow-y:hidden;
       word-break:break-all;
       min-height:40px;
       font-weight:500; 
    }

    
    .description-buttons{
        font-size: 14px;
        display:flex;
        justify-content:space-between;
        margin-top:10px;
        margin-bottom: 10px;
        color:gray;
        p{
            cursor:pointer;
        }
    }
    .recent-comment{
        font-size:12px;
        display:flex;
        align-items:center;
        strong{
            margin-right:10px;
        }
    }
`;

const CommentInput = styled.div`
    padding:10px 0px;
    width:100%;
    display: flex;
    align-items:center;
    justify-content: center;
    border-top:1px solid lightgray;

    input{
        flex:0.9;
        height:30px;
        border:none;
        margin-right:10px;
        outline:none;
    }

    button{
        background-color: transparent;
        border:none;
        outline:none;
        font-size:15px;
        color:#18a4f8;
    }
`;


const AllCommentsContainer = styled.div`
    padding: 15px;
    .post-comment{
        display: flex;
        align-items: center;
        margin-bottom:15px;
        
        .user-image{
            margin-right: 20px; 
            img{
                width:20px;
                height:20px;
                border-radius:50%;
            }
        }
        .user-comment{
            display:flex;
            font-size:13px;
            strong{
                margin-right:10px;
            }

        }
    }
`;

export default Post;
