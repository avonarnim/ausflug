import { Grid } from "@mui/material";
import algoliasearch from "algoliasearch";
import {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Configure,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  InstantSearch,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  SearchBox,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useHits,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  UseHitsProps,
} from "react-instantsearch-hooks-web";
import { AssetCardProps } from "./AssetCard";
import { AssetGrid } from "./AssetGrid";

import "../styles/searchbar.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const searchClient = algoliasearch(
  "S2P17HUIXR",
  "f4deaa69b52860a576dc005a219738c9"
);

function CustomHits(props: UseHitsProps) {
  const { hits } = useHits(props);

  console.log("hits", hits);

  const assetCardValues: AssetCardProps[] = hits as unknown as AssetCardProps[];

  return (
    <section className="grid gap-4">
      {hits.length === 0 && (
        <div className="toast toast-center">
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      )}

      {hits.length > 0 && <AssetGrid assetCards={assetCardValues} />}
    </section>
  );
}

export function SearchBar() {
  return (
    <InstantSearch searchClient={searchClient} indexName={`spots`}>
      <Configure hitsPerPage={16} />
      <Grid item container direction="column" pb={2}>
        <Grid item pb={2}>
          <SearchBox />
        </Grid>
        <Grid item>
          <CustomHits />
        </Grid>
      </Grid>
    </InstantSearch>
  );
}
