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
  paddingBottom: "10px",
  color: "#efefef",
  fontSize: "3rem",
  fontWeight: "bold",
  fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
};

const subcaptionStyle = {
  paddingLeft: "20px",
  color: "#efefef",
  fontSize: "1.5rem",
  fontWeight: 500,
  fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
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
    buttonText: "Search",
    buttonRoute: "/search",
  },
  {
    src: morroBay,
    caption: "Never miss a beat",
    subcaption: "Find the best concerts and shows even on the road.",
    buttonText: "Suggest a new stop",
    buttonRoute: "/addSpot",
  },
  {
    src: aquarium,
    caption: "Choose spontaneity",
    subcaption: "Plot a course now",
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
              {slideImage.buttonText && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to={slideImage.buttonRoute}
                    sx={{
                      color: "#efefef",
                      // backgroundColor: "#3f51b5",
                      // "&:hover": {
                      //   backgroundColor: "#3f51b5",
                      // },
                    }}
                  >
                    {slideImage.buttonText}
                  </Button>
                </Box>
              )}
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
}
