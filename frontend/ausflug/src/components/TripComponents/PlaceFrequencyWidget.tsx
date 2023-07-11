import "../../styles/PlaceFrequencyWidget.css";

interface FrequencyMap {
  [key: string]: number;
}

export function PlaceFrequencyWidget(props: { places: string[] }): JSX.Element {
  // Calculate the frequency of each string
  const frequencyMap: FrequencyMap = props.places.reduce(
    (acc: FrequencyMap, str: string) => {
      acc[str] = (acc[str] || 0) + 1;
      return acc;
    },
    {}
  );

  // Convert the frequency map to the data array format
  const data = Object.entries(frequencyMap).map(([name, count]) => ({
    name,
    value: `${((count / props.places.length) * 100).toFixed(2)}%`,
  }));

  return (
    <div className="widget-container">
      {data.map((item, index) => (
        <div className="widget-item" key={index}>
          <div className="widget-name">{item.name}</div>
          <div className="widget-bar-container">
            <div className="widget-bar" style={{ width: item.value }}>
              <div className="widget-value"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
