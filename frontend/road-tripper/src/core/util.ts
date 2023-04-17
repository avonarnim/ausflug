async function getGoogleImage(reference: string) {
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

export { getGoogleImage };
