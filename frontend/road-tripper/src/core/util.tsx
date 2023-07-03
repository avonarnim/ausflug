import {
  Restaurant,
  Hiking,
  Museum,
  Event,
  Celebration,
  ArrowRight,
  Home,
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
    case "Home":
      return <Home />;
    default:
      return <ArrowRight />;
  }
}

export async function convertToLatLng(
  map: google.maps.Map,
  input:
    | string
    | google.maps.LatLng
    | google.maps.Place
    | google.maps.LatLngLiteral
): Promise<google.maps.LatLng> {
  console.log("convertToLatLng", input);
  if (typeof input === "string") {
    // Convert placeId string to LatLng
    const placeService = new google.maps.places.PlacesService(map);
    return new Promise<google.maps.LatLng>((resolve, reject) => {
      placeService.getDetails(
        { placeId: input, fields: ["geometry"] },
        (placeResult, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            placeResult &&
            placeResult.geometry &&
            placeResult.geometry.location
          ) {
            resolve(placeResult.geometry.location);
          } else {
            reject(new Error("Failed to retrieve place details"));
          }
        }
      );
    });
  } else if (input instanceof google.maps.LatLng) {
    // LatLng type is already provided, return as is
    return input;
  } else if ("placeId" in input) {
    // Convert Place object to LatLng
    const placeService = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    return new Promise<google.maps.LatLng>((resolve, reject) => {
      placeService.getDetails(
        { placeId: input.placeId as string, fields: ["geometry"] },
        (placeResult, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            placeResult &&
            placeResult.geometry &&
            placeResult.geometry.location
          ) {
            resolve(placeResult.geometry.location);
          } else {
            reject(new Error("Failed to retrieve place details"));
          }
        }
      );
    });
  } else if ("lat" in input && "lng" in input) {
    // Convert LatLngLiteral to LatLng
    return new google.maps.LatLng(input);
  }

  // If none of the conversion cases match, throw an error or return a default value
  throw new Error("Invalid input");
}
