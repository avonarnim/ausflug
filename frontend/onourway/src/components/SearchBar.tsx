import { Grid } from "@mui/material";
import { AssetCardProps } from "./AssetCard";
import { AssetGrid } from "./AssetGrid";
import {
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { useMutation } from "../core/api";

import "../styles/searchbar.css";
import { SpotInfoProps } from "./SpotInfo";
import { ProfileProps } from "../pages/Profile";

export function CustomSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"spots" | "users">("spots");
  const [spotSearchResults, setSpotSearchResults] = useState<SpotInfoProps[]>(
    []
  );
  const [profileSearchResults, setProfileSearchResults] = useState<
    ProfileProps[]
  >([]);
  const searchSpots = useMutation("SearchSpots");
  const searchProfiles = useMutation("SearchProfiles");

  const search = async () => {
    if (searchType == "spots") {
      setSpotSearchResults(await searchSpots.commit({ query: searchQuery }));
    } else {
      setProfileSearchResults(
        await searchProfiles.commit({ query: searchQuery })
      );
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
            if (e.key === "Enter") search();
          }}
          label={"Search for " + searchType}
          variant="outlined"
          placeholder="Search..."
          size="medium"
          type="text"
          name="query"
          InputProps={{
            endAdornment: (
              <IconButton type="submit" aria-label="search" onClick={search}>
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
    </Grid>
  );
}
