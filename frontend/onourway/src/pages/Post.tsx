// Page that displays a post

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import { useMutation } from "../core/api";
import { TripProps } from "./EditTrip";
import {
  Edit,
  Delete,
  Favorite,
  FavoriteBorderOutlined,
  Comment,
} from "@mui/icons-material";
import { SpotInfoProps } from "../components/SpotInfo";
import { PostProps } from "./Feed";
import { ProfileProps } from "./Profile";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    marginBottom: theme.spacing(2),
    maxWidth: 600,
  },
  media: {
    width: "300px",
    height: "300px",
    flexShrink: 0,
  },
  content: {
    flex: "1 0 auto",
  },
  author: {
    display: "flex",
    alignItems: "center",
  },
  authorName: {
    marginLeft: theme.spacing(1),
  },
  deleteButton: {
    marginLeft: "auto",
  },
  likeSection: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  likeIcon: {
    marginRight: theme.spacing(1),
  },
  commentInput: {
    marginTop: theme.spacing(2),
  },
}));

export default function Post(): JSX.Element {
  const { currentUser, updateUserProfile, setError } = useAuth();
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [post, setPost] = useState<PostProps>();
  const [comment, setComment] = useState<string>("");

  const params = useParams();

  const getProfile = useMutation("GetProfile");
  const getPost = useMutation("GetPost");
  const updatePost = useMutation("UpdatePost");
  const deletePost = useMutation("DeletePost");
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.postId) {
      getPostCallback(params.postId);
    }
  }, [params.postId]);

  const getPostCallback = async (postId: string) => {
    const getPostResponse = await getPost.commit({
      postId: postId,
    });
    setPost(getPostResponse);
  };

  const handleDelete = async () => {
    if (post) {
      const deleteResponse = await deletePost.commit({
        _id: post._id,
        authorId: post.authorId,
      });
    }
  };

  const handleUpdate = async (post: PostProps) => {
    if (post) {
      const updateResponse = await updatePost.commit({
        ...post,
      });
    }
  };

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const addComment = async () => {
    post?.comments.push({
      userId: currentUser.uid,
      comment: comment,
      createdAt: Date.now(),
    });
    if (post) {
      await handleUpdate(post);
    }
    setComment("");
  };

  return (
    <Grid item container xs direction="row" sx={{ p: 4 }}>
      <Grid container spacing={2}>
        {post ? (
          <Card className={classes.root}>
            <CardMedia
              className={classes.media}
              image={post.images[0]}
              title="Post Image"
            />
            <CardContent className={classes.content}>
              <div className={classes.author}>
                <Avatar src={post.authorImage} alt={post.authorUsername} />
                <Typography
                  variant="subtitle1"
                  className={classes.authorName}
                  onClick={() => navigate(`/profile/${post.authorId}`)}
                >
                  {post.authorUsername}
                </Typography>
                {currentUser.uid === post.authorId && (
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    className={classes.deleteButton}
                    onClick={handleDelete}
                  >
                    <Delete />
                  </IconButton>
                )}
              </div>
              <Paper
                style={{ height: 150, overflow: "auto", boxShadow: "none" }}
              >
                <List dense sx={{ width: "100%" }}>
                  {post.comments.map((comment) => (
                    <ListItem>
                      <ListItemText
                        primary={comment.userId}
                        secondary={comment.comment}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              <div className={classes.likeSection}>
                <IconButton
                  aria-label="like"
                  color="secondary"
                  className={classes.likeIcon}
                  onClick={() => {
                    post.likes.push({ userId: currentUser.uid });
                    if (post) {
                      handleUpdate(post);
                    }
                  }}
                >
                  {post.likes.find((like) => like === currentUser.uid) !==
                  undefined ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography variant="body1">
                  {post.likes.length} likes
                </Typography>
              </div>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Add a comment..."
                className={classes.commentInput}
                label="Comment"
                value={comment}
                onChange={handleCommentChange}
                // Implement the functionality to add a new comment
                // when the user presses enter or clicks a "Post" button
                // using appropriate event handlers (not shown in this example)
              />
              <Button onClick={() => addComment()}>Comment</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Typography>No such post can be found</Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
}
