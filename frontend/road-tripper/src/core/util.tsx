import {
  NearMe,
  Delete,
  Add,
  Restaurant,
  Hiking,
  Museum,
  Event,
  Celebration,
  ArrowRight,
} from "@mui/icons-material";

export async function getGoogleImage(reference: string) {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${reference}&key=${process.env.REACT_APP_MAPS_KEY}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {},
  });

  if (res.ok) {
    const data =
      res.status === 204
        ? undefined
        : res.headers.get("content-type")?.includes("application/json")
        ? await res.json()
        : await res.text();
    return data;
  }
}

export function categoryToIcon(category: string): JSX.Element {
  switch (category) {
    case "Restaurant":
    case "Dining":
      return <Restaurant />;
    case "Nature":
    case "Hiking":
      return <Hiking />;
    case "History":
    case "Museum":
      return <Museum />;
    case "Concert":
    case "Event":
    case "Venue":
      return <Event />;
    case "Party":
    case "Celebration":
      return <Celebration />;
    default:
      return <ArrowRight />;
  }
}
