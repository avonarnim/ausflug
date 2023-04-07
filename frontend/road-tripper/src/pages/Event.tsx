export type EventProps = {
  _id: string;
  title: string;
  image: string;
  description: string;
  spot_id: string;
  location: {
    lat: number;
    lng: number;
  };
  externalIds: [{ source: string; id: string }];
  externalLink: string;
  place_id: string;
  sponsored: boolean;
  status: string;
  startDate: string;
  endDate: string;
};
