import { Grid } from "@mui/material";
import { AssetCardProps } from "./AssetCard";
import { AssetGrid } from "./AssetGrid";
import {
  Button,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useMutation } from "../core/api";

import "../styles/searchbar.css";
import { SpotInfoProps } from "./SpotInfo";
import { ProfileProps } from "../pages/Profile";

export function CustomSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"spots" | "users">("spots");
  const [spotPage, setSpotPage] = useState(0);
  const [profilePage, setProfilePage] = useState(0);
  const [spotSearchResults, setSpotSearchResults] = useState<SpotInfoProps[]>(
    []
  );
  const [profileSearchResults, setProfileSearchResults] = useState<
    ProfileProps[]
  >([]);
  const searchSpots = useMutation("SearchSpots");
  const searchProfiles = useMutation("SearchProfiles");

  useEffect(() => {
    handleInitialSearch();
  }, []);

  const handleInitialSearch = async () => {
    setSpotSearchResults(
      await searchSpots.commit({ query: "a", page: spotPage })
    );
    setProfileSearchResults(
      await searchProfiles.commit({ query: "a", page: profilePage })
    );
  };

  const search = async (props: { isNewQuery: boolean; page: number }) => {
    if (searchType == "spots") {
      const results = await searchSpots.commit({
        query: searchQuery,
        page: props.page,
      });
      if (props.isNewQuery) setSpotSearchResults(results);
      else setSpotSearchResults(spotSearchResults.concat(results));
    } else {
      const results = await searchProfiles.commit({
        query: searchQuery,
        page: props.page,
      });
      if (props.isNewQuery) setProfileSearchResults(results);
      else setProfileSearchResults(profileSearchResults.concat(results));
    }
  };

  return (
    <Grid item container direction="column" pb={2}>
      <Grid item container direction="row" alignItems="center">
        <ToggleButtonGroup
          value={searchType}
          exclusive
          onChange={(event, newSearchType: "spots" | "users") =>
            setSearchType(newSearchType)
          }
          aria-label="outlined button group"
          sx={{ p: 2 }}
        >
          <ToggleButton value="spots" aria-label="spots">
            Spots
          </ToggleButton>
          <ToggleButton value="users" aria-label="users">
            Users
          </ToggleButton>
        </ToggleButtonGroup>
        <TextField
          autoFocus
          margin="dense"
          id="search-bar"
          className="text"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search({ isNewQuery: true, page: 0 });
          }}
          label={"Search for " + searchType}
          variant="outlined"
          placeholder="Search..."
          size="medium"
          type="text"
          name="query"
          InputProps={{
            endAdornment: (
              <IconButton
                type="submit"
                aria-label="search"
                onClick={() => search({ isNewQuery: true, page: 0 })}
              >
                <Search style={{ fill: "blue" }} />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item>
        {searchType === "spots" && spotSearchResults.length > 0 && (
          <AssetGrid
            assetCards={spotSearchResults.map((spot) => {
              return {
                id: spot._id,
                title: spot.title,
                description: spot.description,
                image: spot.images[0],
                type: "spots",
              };
            })}
          />
        )}
        {searchType === "users" && profileSearchResults.length > 0 && (
          <AssetGrid
            assetCards={profileSearchResults.map((profile) => {
              return {
                id: profile._id,
                title: profile.username,
                description: profile.bio,
                image: profile.image,
                type: "profile",
              };
            })}
          />
        )}
      </Grid>
      {/* Button with text "load more results" that increases the "page" variable's value by 1 & re-runs the search function & appends the results to the existing results  */}

      {((searchType === "spots" && spotSearchResults.length === 50) ||
        (searchType === "users" && profileSearchResults.length > 0)) &&
        searchQuery.length > 0 && (
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                if (searchType === "spots") {
                  setSpotPage(spotPage + 1);
                  search({ isNewQuery: false, page: spotPage + 1 });
                } else {
                  setProfilePage(profilePage + 1);
                  search({ isNewQuery: false, page: profilePage + 1 });
                }
              }}
            >
              Load More Results
            </Button>
          </Grid>
        )}
    </Grid>
  );
}
