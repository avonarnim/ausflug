import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "../components/SpotInfo";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useAuth } from "../core/AuthContext";
import {
  FavoriteOutlined,
  FavoriteBorderOutlined,
  SendOutlined,
} from "@mui/icons-material";

export default function Feed(): JSX.Element {
  const [comments, setComments] = useState<Record<string, string>>({});

  const { currentUser } = useAuth();

  const [posts, setPosts] = useState<PostProps[]>([]);

  const getPosts = useMutation("GetFeedPosts");
  const updatePost = useMutation("UpdatePost");

  useEffect(() => {
    if (currentUser.uid) {
      getPosts.commit({ userId: currentUser.uid }).then((posts) => {
        setPosts(posts);
      });
    }
  }, [currentUser]);

  const handleCommentChange = (
    postId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };

  const handleLikeClick = async (post: PostProps) => {
    post.likes.push(currentUser.uid);
    await updatePost.commit({ ...post });
  };

  const handleCommentSubmit = async (post: PostProps) => {
    const comment = comments[post._id];
    post.comments.push({
      userId: currentUser.uid,
      comment,
      createdAt: Date.now(),
    });
    await updatePost.commit({ ...post });
    console.log(`Comment added for post ${post._id}: ${comment}`);
  };

  const renderComments = (post: PostProps) => {
    const displayedComments = post.comments.slice(0, 3);

    return displayedComments.map((comment, index) => (
      <Typography key={index} variant="body2">
        <strong>{comment.userId}: </strong>
        {comment.comment}
      </Typography>
    ));
  };

  return currentUser.uid && posts.length > 0 ? (
    <Container sx={{ marginTop: 4 }}>
      <Box>
        <Grid item container>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card>
                <CardHeader title={post.authorUsername} />
                <CardMedia
                  component="img"
                  src={post.images[0]}
                  alt={post.authorUsername}
                />
                <CardContent>
                  <Typography variant="body2">{post.caption}</Typography>
                  <Typography variant="body2">{`${post.likes.length} likes`}</Typography>
                  <IconButton
                    onClick={() => handleLikeClick(post)}
                    color={
                      post.likes.filter((x) => x.userId === currentUser.uid)
                        .length > 0
                        ? "secondary"
                        : "default"
                    }
                  >
                    {post.likes.filter((x) => x.userId === currentUser.uid)
                      .length > 0 ? (
                      <FavoriteOutlined />
                    ) : (
                      <FavoriteBorderOutlined />
                    )}
                  </IconButton>
                  {renderComments(post)}
                  <TextField
                    fullWidth
                    label="Add a comment"
                    value={comments[post._id] || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleCommentChange(post._id, e)
                    }
                    variant="outlined"
                  />
                  <IconButton
                    onClick={() => handleCommentSubmit(post)}
                    color="primary"
                    disabled={!comments[post._id]}
                  >
                    <SendOutlined />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  ) : (
    <Container>
      <Box>
        <CircularProgress />
      </Box>
    </Container>
  );
}

export type PostProps = {
  _id: string;
  authorId: string;
  authorUsername: string;
  authorImage: string;
  images: string[];
  caption: string;
  comments: { userId: string; comment: string; createdAt: number }[];
  likes: { userId: string }[];
  createdAt: number;
};
