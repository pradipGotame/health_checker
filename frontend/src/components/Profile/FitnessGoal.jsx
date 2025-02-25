import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const fitnessGoals = [
  'lose weight',
  'gain muscle',
  'improve fitness',
  'maintain health'
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
          label="Fitness Goal"
          variant="outlined"
        />
      )}
    />
  );
}
