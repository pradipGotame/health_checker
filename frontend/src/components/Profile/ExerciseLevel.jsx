import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';


const exerciseLevel = [
  { title: 'Beginner' },
  { title: 'Intermediate' },
  { title: 'Advanced' },
  { title: 'Expert' },
  { title: 'Professional' },

];


export default function ExerciseLevel({ value, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };
  return (
    <Stack margin="normal">
      <Autocomplete
        freeSolo
        id="exerciseLevel"
        disableClearable
        options={exerciseLevel.map((option) => option.title)}
        value={value || null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label="Search/Select your Level"
            slotProps={{
              input: {
                ...params.InputProps,
                type: 'search',
              },
            }}
          />
        )}
      />
    </Stack>
  );
}


