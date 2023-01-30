import { Masonry } from "@mui/lab";
import { BoxProps } from "@mui/material";
import { AssetCard, AssetCardProps } from "./AssetCard";
import { Paper, styled } from "@mui/material";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  border: "none",
}));

export function AssetGrid(props: AssetGridProps): JSX.Element {
  const assets = props.assetCards;

  return (
    <Masonry columns={{ xs: 1, sm: 1, md: 2, lg: 3 }} spacing={1}>
      {assets.map((_, i) => (
        <Item variant="outlined" key={`asset-grid-${i}`}>
          <AssetCard
            key={i}
            title={assets[i].title}
            description={assets[i].description}
            image={assets[i].image}
            id={assets[i].id}
          />
        </Item>
      ))}
    </Masonry>
  );
}

type AssetGridProps = Omit<BoxProps, "children"> & {
  assetCards: AssetCardProps[];
};
