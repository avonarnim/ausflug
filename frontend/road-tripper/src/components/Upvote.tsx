import React from "react";

export function Upvote() {
  const [count, setCount] = React.useState(0);
  const [addend, setAddend] = React.useState(0);

  const toggleIncrement = () => {
    setAddend(addend === 1 ? 0 : 1);
  };

  const toggleDecrement = () => {
    setAddend(addend === -1 ? 0 : -1);
  };

  return (
    <div>
      <button onClick={toggleIncrement}>+</button>
      <span>{count + addend}</span>
      <button onClick={toggleDecrement}>-</button>
    </div>
  );
}
