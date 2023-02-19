import { MapQueueSpotForm } from "../forms/MapQueueSpot";
import { QueueSpotForm } from "../forms/QueueSpot";

export default function AddSpot(): JSX.Element {
  return (
    <div>
      <p>Use this form to help us add more unique, exciting spots!</p>
      {/* <QueueSpotForm /> */}
      <MapQueueSpotForm />
    </div>
  );
}
