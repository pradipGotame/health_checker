import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function FreeSolo({ value, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };
  return (
    <Stack spacing={2} sx={{ width: "80%", minWidth: 215 }}>
      <Autocomplete
        freeSolo
        id="exeerise-level"
        disableClearable
        options={exerciseLevel.map((option) => option.title)}
        value={value || null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
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

const exerciseLevel = [
  { title: 'Beginer' },
  { title: 'Intermediate' },
  { title: 'Advanced' },
  { title: 'Expert' },
  { title: 'Professional' },

];
