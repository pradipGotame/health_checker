import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const location = [
  'Home',
  'Gym',
  'Outdoor',
];

export default function Location({ value, onChange }) {
  return (
    <Autocomplete
      value={value || null}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      options={location}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          label="Location"
          variant="outlined"
        />
      )}
    />
  );
}