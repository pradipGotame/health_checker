import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const fitnessGoals = [
  'Lose Weight',
  'Gain Muscle',
  'Improve Fitness',
  'Maintain Health'
];

export default function FitnessGoal({ value, onChange }) {
  return (
    <Autocomplete
      value={value || null}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      options={fitnessGoals}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          label="Fitness Goal"
          variant="outlined"
        />
      )}
    />
  );
}
