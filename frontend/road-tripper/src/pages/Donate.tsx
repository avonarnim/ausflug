// import React, { useState, useRef } from "react";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { TextField, Button } from "@mui/material";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!);

// const Donate = () => {
//   options = {};
//   const [error, setError] = useState(null);
//   const cardElementRef = useRef(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardElementRef.current,
//     });

//     if (error) {
//       setError(error.message);
//     } else {
//       console.log(paymentMethod);
//       // Here you can send the paymentMethod object to your server and process the payment
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField
//         label="Card details"
//         inputRef={cardElementRef}
//         fullWidth
//         margin="normal"
//         variant="outlined"
//       />
//       {error && <div>{error}</div>}
//       <Button type="submit" variant="contained" color="primary">
//         Donate
//       </Button>
//     </form>
//   );
// };

const Donate = () => {
  return <></>;
};

export default Donate;
