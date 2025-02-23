import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function FreeSolo() {
  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 215 }}>
      <Autocomplete
        freeSolo
        id="location"
        disableClearable
        options={location.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search/Select the Location"
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

const location = [
    { title: 'Home'},
    { title: 'Gym'},
    { title: 'Outdoor'},

];
