import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SetStateAction, useEffect, useState } from "react";
import {
  useParams,
  Link as RouterLink,
  redirect,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../core/AuthContext";
import logo250 from "../assets/logo250.png";
import { useMutation } from "../core/api";
import ProfileFormDialog from "../dialogs/EditProfileDialog";
import { TripProps } from "./EditTrip";
import {
  Edit,
  AccountCircle,
  Delete,
  ConnectingAirportsOutlined,
} from "@mui/icons-material";
import { SpotInfoProps } from "../components/SpotInfo";
import RandomTripButton from "../components/RandomTripButton";
import FollowList from "../dialogs/FollowList";
import {
  ProfileStatus,
  ProfileStatusSelector,
  Status,
  statusMap,
  StyledIndicator,
} from "../components/ProfileStatus";
import { PostProps } from "./Feed";
import { EditGear, FindGear, GearList } from "../components/EditGear";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const generateSocialLink = (
  platform: string,
  link: string | undefined,
  src: string
) => {
  return link === undefined || link === "" ? null : (
    <Grid item>
      <Link href={link}>
        <Img sx={{ width: 24, height: 24 }} alt={platform} src={src} />
      </Link>
    </Grid>
  );
};

export function FollowingButton(props: {
  thisUserId: string;
  userId: string;
  following: string[];
}): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const followProfile = useMutation("FollowProfile");
  const unfollowProfile = useMutation("UnfollowProfile");

  console.log("following", props.following, props.userId);

  return (
    <>
      {props.userId ? (
        props.following && props.following.includes(props.userId) ? (
          <Button
            variant="contained"
            color="primary"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              console.log("unfollow");
              unfollowProfile.commit({
                profileId: props.thisUserId,
                followingId: props.userId,
              });
            }}
          >
            {isHovered ? "Unfollow" : "Following"}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              console.log("follow");
              followProfile.commit({
                profileId: props.thisUserId,
                followingId: props.userId,
              });
            }}
          >
            Follow
          </Button>
        )
      ) : (
        <></>
      )}
    </>
  );
}

export default function Profile(props: {
  indicator: "none" | "id" | "username";
}): JSX.Element {
  const { currentUser, updateUserProfile, setError } = useAuth();
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<ProfileProps | null>(null);
  const [thisUser, setThisUser] = useState<ProfileProps | null>(null);
  const [trips, setTrips] = useState<TripProps[] | null>(null);
  const [spots, setSpots] = useState<SpotInfoProps[] | null>(null);
  const [statusesAndGear, setStatusesAndGear] = useState<
    | {
        _id: string;
        name: string;
        username: string;
        image: string;
        status: string;
        gear: {
          name: string;
          description: string;
          quantity: number;
          borrowable: boolean;
        }[];
      }[]
    | null
  >(null);
  const [posts, setPosts] = useState<PostProps[]>([]);

  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const getProfile = useMutation("GetProfile");
  const getProfileByUsername = useMutation("GetProfileByUsername");
  const getUserTrips = useMutation("GetUserTrips");
  const getSpotsList = useMutation("GetSpotsList");
  const unsaveSpot = useMutation("UnsaveSpotFromUser");
  const getStatusesAndGear = useMutation("GetStatusesAndGear");
  const getPosts = useMutation("GetUserPosts");

  useEffect(() => {
    if (props.indicator === "none") {
      setUserId(currentUser.uid);
      getProfileCallback(currentUser.uid, setUser);
      getTripsCallback(currentUser.uid);
      getSpotsCallback(currentUser.uid);
      getStatusesAndGearCallback(currentUser.uid);
      getPostsCallback(currentUser.uid);
    } else if (props.indicator === "id") {
      if (params.userId === currentUser?.uid) {
        setUserId(currentUser.uid);
        getProfileCallback(currentUser.uid, setUser);
        getTripsCallback(currentUser.uid);
        getSpotsCallback(currentUser.uid);
        getStatusesAndGearCallback(currentUser.uid);
        getPostsCallback(currentUser.uid);
      } else if (params.userId) {
        setUserId(params.userId);
        getProfileCallback(params.userId, setUser);
        getPostsCallback(params.userId);
        if (currentUser?.uid) getProfileCallback(currentUser.uid, setThisUser);
      }
    } else if (props.indicator === "username") {
      if (params.username) {
        usernameProfileSetup(params.username);
      }
    } else {
      console.log("no user");
    }
  }, [params.userId, params.username]);

  useEffect(() => {
    setIsCurrentUser(
      (!params.userId && currentUser) || params.userId === currentUser?.uid
    );
  }, [params.userId, params.username, currentUser]);

  const getProfileCallback = async (
    userId: string,
    setter: { (value: SetStateAction<ProfileProps | null>): void }
  ) => {
    const getUserResponse = await getProfile.commit({ profileId: userId });
    console.log(getUserResponse);
    setter(getUserResponse);
  };

  const getTripsCallback = async (userId: string) => {
    const getUserTripsResponse = await getUserTrips.commit({
      userId: userId,
    });
    setTrips(getUserTripsResponse);
    console.log("trips set", getUserTripsResponse);
  };

  const getSpotsCallback = async (userId: string) => {
    const getSpotsResponse = await getSpotsList.commit({
      userId: userId,
    });
    setSpots(getSpotsResponse);
    console.log("spots set", getSpotsResponse);
  };

  const getStatusesAndGearCallback = async (userId: string) => {
    const getStatusesAndGearResponse = await getStatusesAndGear.commit({
      profileId: userId,
    });
    setStatusesAndGear(getStatusesAndGearResponse);
    console.log("statuses set", getStatusesAndGearResponse);
  };

  const getPostsCallback = async (userId: string) => {
    const getPostsResponse = await getPosts.commit({
      userId: userId,
    });
    setPosts(getPostsResponse);
    console.log("posts set", getPostsResponse);
  };

  const usernameProfileSetup = async (username: string) => {
    const getUserResponse = await getProfileByUsername.commit({
      username: username,
    });

    if (getUserResponse) {
      setUserId(getUserResponse._id);
      setUser(getUserResponse);
      getPostsCallback(getUserResponse._id);

      if (currentUser.uid === getUserResponse._id) {
        setIsCurrentUser(true);
        getTripsCallback(getUserResponse._id);
        getSpotsCallback(getUserResponse._id);
        getStatusesAndGearCallback(getUserResponse._id);
      } else {
        setIsCurrentUser(false);
        if (currentUser.uid) getProfileCallback(currentUser.uid, setThisUser);
      }
    }
  };

  const removeSpot = async (spotId: string, userId: string) => {
    setSpots(spots!.filter((tempSpot) => tempSpot._id !== spotId));
    await unsaveSpot.commit({
      spotId: spotId,
      userId: userId,
    });
  };

  const instagramLink = generateSocialLink(
    "instagram",
    user?.instagram,
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-1024.png"
  );
  const twitterLink = generateSocialLink(
    "twitter",
    user?.twitter,
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter_colored_svg-1024.png"
  );
  const youtubeLink = generateSocialLink(
    "youtube",
    user?.youtube,
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png"
  );
  const facebookLink = generateSocialLink(
    "facebook",
    user?.facebook,
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-1024.png"
  );

  return (
    <Grid item container xs direction="row" sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              {user && user.image ? (
                <img
                  src={user.image}
                  alt={user.name + " profile photo"}
                  style={{
                    borderRadius: "50%",
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 200 }} />
              )}
            </Grid>
            <Grid item>
              {user && isCurrentUser ? (
                <ProfileFormDialog {...user} />
              ) : (
                currentUser?.uid &&
                params.userId &&
                thisUser?.following && (
                  <FollowingButton
                    thisUserId={currentUser.uid as string}
                    userId={params.userId}
                    following={thisUser?.following}
                  />
                )
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs sx={{ minWidth: 450 }}>
          <Typography gutterBottom variant="h4" component="div">
            {user?.name}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            @{user?.username}
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {user?.bio}
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {user?.points ?? 0} points
          </Typography>
          {isCurrentUser
            ? user && <ProfileStatusSelector user={user} />
            : user && <ProfileStatus user={user} />}
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <FollowList
                userId={userId}
                users={user?.followers || []}
                following={false}
              />
            </Grid>
            <Grid item>
              <FollowList
                userId={userId}
                users={user?.following || []}
                following={true}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} sx={{ pb: 4 }}>
            {facebookLink}
            {youtubeLink}
            {instagramLink}
            {twitterLink}
          </Grid>
        </Grid>
        {isCurrentUser && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="h5">Saved Trips</Typography>
              <List>
                {trips?.map((trip) => (
                  <ListItem
                    key={trip.name + trip._id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="edit">
                        <Link href={`/trips/${trip._id}`}>
                          <Edit />
                        </Link>
                      </IconButton>
                    }
                  >
                    {trip.image && (
                      <ListItemAvatar>
                        <Avatar alt={trip.name} src={trip.image} />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={
                        trip.name +
                        (trip.description ? ": " + trip.description : "")
                      }
                      secondary={trip.originVal + " to " + trip.destinationVal}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5">Saved Spots</Typography>
              <List>
                {spots?.map((spot) => (
                  <ListItem
                    key={spot._id}
                    onClick={() => {
                      navigate(`/spots/${spot._id}`);
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => removeSpot(spot._id, currentUser.uid)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    {spot.images.length > 0 && (
                      <ListItemAvatar>
                        <Avatar alt={spot.title} src={spot.images[0]} />
                      </ListItemAvatar>
                    )}
                    <ListItemText
                      primary={spot.title}
                      secondary={spot.description}
                    />
                  </ListItem>
                ))}
              </List>
              {/* TODO: go to NewTrip page with a random set of the saved spots pre-loaded and either the current location or first spot's location set as the beginning/end */}
              {spots && spots.length > 0 && <RandomTripButton spots={spots} />}
            </Grid>
          </>
        )}
        {isCurrentUser && (
          <Grid item xs={6}>
            {/* Display statusResults with styled indicator as seen in ProfileStatus.tsx */}
            <Typography variant="h5">Statuses</Typography>
            <List>
              {statusesAndGear?.map((status) => (
                <ListItem key={status._id + "_status"}>
                  {status.image && (
                    <ListItemAvatar>
                      <Avatar alt={status.username} src={status.image} />
                    </ListItemAvatar>
                  )}
                  <ListItemText
                    primary={status.username}
                    secondary={status.status}
                  />
                  <StyledIndicator color={statusMap[status.status as Status]} />
                </ListItem>
              ))}
            </List>
          </Grid>
        )}
        {isCurrentUser
          ? user && (
              <Grid item xs={6}>
                <Typography variant="h5">Gear</Typography>
                <EditGear {...user} />
              </Grid>
            )
          : user && (
              <Grid item xs={6}>
                <Typography variant="h5">Gear</Typography>
                <GearList gear={user.gear} />
              </Grid>
            )}
        {isCurrentUser && statusesAndGear && (
          <Grid item xs={6}>
            {<FindGear usersGear={statusesAndGear} />}
          </Grid>
        )}
        {
          <Grid item xs={6}>
            {/* Display statusResults with styled indicator as seen in ProfileStatus.tsx */}
            <Typography variant="h5">Posts</Typography>
            <ImageList
              sx={{ width: 500, height: 450 }}
              cols={3}
              rowHeight={164}
            >
              {posts.map((post) => (
                <ImageListItem
                  key={post._id}
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <img
                    src={`${post.images[0]}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${post.images[0]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={post.caption}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
        }
      </Grid>
    </Grid>
  );
}

export type ProfileProps = {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  image: string;
  following: string[];
  followers: string[];
  savedTripIDs: string[];
  upcomingTripsID: string[];
  savedSpots: string[];
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  status: string;
  points: number;
  gear: {
    name: string;
    description: string;
    quantity: number;
    borrowable: boolean;
  }[];
  createdAt: number;
};
