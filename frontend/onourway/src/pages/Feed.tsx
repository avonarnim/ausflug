import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useMutation } from "../core/api";
import { SpotInfoProps } from "../components/SpotInfo";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import { useAuth } from "../core/AuthContext";
import {
  FavoriteOutlined,
  FavoriteBorderOutlined,
  MoreVert,
  Delete,
} from "@mui/icons-material";

export default function Feed(): JSX.Element {
  const [comments, setComments] = useState<Record<string, string>>({});

  const { currentUser } = useAuth();

  const [posts, setPosts] = useState<PostProps[]>([]);

  const getPosts = useMutation("GetFeedPosts");
  const updatePost = useMutation("UpdatePost");
  const deletePost = useMutation("DeletePost");

  const navigate = useNavigate();

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleEditClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteClick = async (post: PostProps) => {
    await deletePost.commit({ _id: post._id, authorId: currentUser.uid });
    setPosts(posts.filter((p) => p._id !== post._id));
    setAnchorEl(null);
  };

  return currentUser.uid && posts.length > 0 ? (
    <Container sx={{ marginTop: 4 }}>
      <Box>
        <Grid item container>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card>
                <CardHeader
                  title={post.authorUsername}
                  action={
                    post.authorId === currentUser.uid && (
                      <IconButton
                        aria-label="settings"
                        onClick={handleEditClick}
                      >
                        <MoreVert />
                        <Menu
                          anchorEl={anchorEl}
                          id="account-menu"
                          open={open}
                          onClose={handleEditClose}
                          onClick={handleEditClose}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <MenuItem onClick={() => handleDeleteClick(post)}>
                            <ListItemIcon>
                              <Delete fontSize="small" />
                            </ListItemIcon>
                            Delete
                          </MenuItem>
                        </Menu>
                      </IconButton>
                    )
                  }
                />
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
                  <Grid container xs={12}>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        label="Add a comment"
                        value={comments[post._id] || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCommentChange(post._id, e)
                        }
                        variant="outlined"
                      />
                    </Grid>
                    <Grid xs={2}>
                      <Button
                        onClick={() => handleCommentSubmit(post)}
                        color="primary"
                        disabled={!comments[post._id]}
                      >
                        Post
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  ) : (
    <Container>
      <Box sx={{ p: 4 }}>
        <Box sx={{ pb: 2 }}>
          <CircularProgress />
          <Typography variant="h5">Loading...</Typography>
        </Box>

        <Typography>Follow more users to see their posts</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/search")}
        >
          Find Users
        </Button>
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
