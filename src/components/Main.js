import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Main(props) {
  const { posts: initialPosts, title } = props; // Renamed props.posts to initialPosts
  const [posts, setPosts] = useState(initialPosts); // State to hold posts
  const [replies, setReplies] = useState([]);
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    if (initialPosts) {
      setReplies(initialPosts.map(() => []));
    }
    // Retrieve user data from local storage when component mounts
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [initialPosts]);

  const handleReply = (postId, replyText) => {
    const updatedReplies = [...replies];
    if (!updatedReplies[postId]) {
      updatedReplies[postId] = [];
    }
    updatedReplies[postId] = [...updatedReplies[postId], replyText];
    setReplies(updatedReplies);
  };

  const handleDeletePost = (postId) => {
    console.log(`Attempting to delete post with id ${postId}`);
    // Check if the user is a moderator before allowing deletion
    if (userData && userData.role === 'Moderator') {
      // Implement delete logic for posts here
      console.log(`Post with id ${postId} deleted.`);
      // Update the state to remove the deleted post
      const updatedPosts = [...posts];
      updatedPosts.splice(postId, 1);
      setPosts(updatedPosts);
      alert(`Post with id ${postId} deleted.`);
    } else {
      console.log("You don't have permission to delete this post.");
      alert("You don't have permission to delete this post.");
    }
  };

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {posts && posts.map((post, index) => (
        <div key={index}>
          <Markdown className="markdown">{post}</Markdown>
          <div style={{ marginTop: '1rem' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write your reply"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleReply(index, e.target.value);
                  e.target.value = ''; // Clear the input field after submitting
                }
              }}
              InputProps={{ sx: { border: 'none', outline: 'none' } }} // Remove border here
            />
            {replies[index] && replies[index].map((reply, replyIndex) => (
              <div key={replyIndex} style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
                <Typography variant="body2" color="textSecondary">
                  Replies: {reply}
                </Typography>
              </div>
            ))}
          </div>
          
          <Button variant="outlined" onClick={() => handleDeletePost(index)} style={{ marginTop: '1rem' }}>
            Delete Post
          </Button>

        </div>
      ))}
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
};

export default Main;
