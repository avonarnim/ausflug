import React, { useEffect, useRef } from "react";
import car from "../assets/homeCanvasAnimation/car_small.png";

export default function CarAnimation() {
  const carCanvasRef = useRef<HTMLCanvasElement>(null);
  const carPosX = [5, 25];
  const carMultipliers = [1.3, 1.0];

  useEffect(() => {
    const carCanvas = carCanvasRef.current;
    const ctx = carCanvas?.getContext("2d");

    const handleResize = () => {
      if (carCanvas == null) return;
      carCanvas.height = 105;
      carCanvas.width = window.innerWidth;
      animate();
    };

    const handleWheel = (e: WheelEvent) => {
      carPosX[0] += e.deltaY * carMultipliers[0];
      //   carPosX[1] += e.deltaY * carMultipliers[1];

      carPosX.forEach((pos, i) => {
        if (carCanvas && pos > carCanvas.width) {
          carPosX[i] = carCanvas.width;
        } else if (pos < 0) {
          carPosX[i] = 0;
        }
      });

      animate();
    };

    const animate = () => {
      if (carCanvas == null || ctx == null) return;
      ctx.clearRect(0, 0, carCanvas.width, carCanvas.height);
      ctx.drawImage(carImage, carPosX[0], 5);
      //   ctx.drawImage(truckImage, carPosX[1], 125);
      //   ctx.drawImage(img, carPosX[2], 245);
      //   ctx.drawImage(img, carPosX[3], 365);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("wheel", handleWheel);

    const carImage = new Image();
    carImage.alt = "car";
    carImage.src = car;
    carImage.onload = () => {
      animate();
    };

    if (carCanvas) {
      carCanvas.height = 105;
      carCanvas.width = window.innerWidth;
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="body-container">
      <canvas ref={carCanvasRef} id="carCanvas"></canvas>
    </div>
  );
}
