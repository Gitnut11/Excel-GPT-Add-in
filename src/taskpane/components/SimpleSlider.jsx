import React, { useState } from "react";
import { Slider, Box } from "@mui/material";

const SimpleSlider = (props) => {
  const handleChange = (event, newValue) => {
    props.setter(newValue);
  };

  return (
    <Box sx={{ width: 200, padding: 0}}>
      <Slider min={0} max={2} step={0.01} value={props.value} onChange={handleChange} valueLabelDisplay="auto" />
    </Box>
  );
};

export default SimpleSlider;
