import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function FreeSolo() {
  return (
    <Stack spacing={2} sx={{ width: "100%", minWidth: 215 }}>
      <Autocomplete
        freeSolo
        id="activity-type"
        disableClearable
        options={activityType.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search/Select the Activity Type"
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

const activityType = [
    { title: 'Strength training'},
    { title: 'Cardio'},
    { title: 'HIIT'},
    { title: 'Endurance'},
    { title: 'Flexibility'},
    { title: 'Calisthenics'},
    { title: 'Mindfulness'},
    { title: 'Yoga' },
    { title: 'Pilates' },
    { title: 'Jogging' },
    { title: 'Swimming' },
    { title: 'Cycling' },
    { title: 'Jump Rope' },
    { title: 'No Equipment Exercise' },
];
