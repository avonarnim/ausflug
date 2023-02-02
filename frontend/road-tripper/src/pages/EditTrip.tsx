export default function EditTrip(): JSX.Element {
  return (
    <div>
      <p>hey</p>
    </div>
  );
}

export type TripProps = {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  spotIds: string[];
  startLongitude: number;
  startLatitude: number;
  endLongitude: number;
  endLatitude: number;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  isComplete: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};
