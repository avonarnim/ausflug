import { Box, Button, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import hanaleiKauai from "../assets/hanaleiKauai.jpg";
import morroBay from "../assets/morroBay.jpg";
import aquarium from "../assets/aquarium.jpg";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const captionStyle = {
  paddingTop: "60px",
  paddingLeft: "20px",
  paddingBottom: "20px",
  color: "#efefef",
  fontSize: "3rem",
};

const subcaptionStyle = {
  paddingLeft: "20px",
  color: "#efefef",
  fontSize: "2rem",
};

const divStyle = {
  display: "block",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  height: "400px",
  width: "100%",
};

const slideImages = [
  {
    src: hanaleiKauai,
    caption: "Find unique destinations",
    subcaption: "Search through curated, memorable detours",
    buttonText: "/search",
    buttonRoute: "/search",
  },
  {
    src: morroBay,
    caption: "Never miss a beat",
    subcaption: "Find the best concerts, shows, and more even on the road.",
    buttonText: "Suggest a new stop",
    buttonRoute: "/addSpot",
  },
  {
    src: aquarium,
    caption: "Set the mood before you hit the road",
    subcaption: "Let others help plan trips and queue the perfect playlist",
    buttonText: "Find your playlist",
    buttonRoute: "/playlist",
  },
];

export function HeroCarousel(): JSX.Element {
  return (
    <div className="slide-container">
      <Fade indicators={true} arrows={false}>
        {slideImages.map((slideImage, index) => (
          <div className="each-fade" key={index}>
            <div
              style={{ ...divStyle, backgroundImage: `url(${slideImage.src})` }}
            >
              <p style={captionStyle}>{slideImage.caption}</p>
              <p style={subcaptionStyle}>{slideImage.subcaption}</p>
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
}
