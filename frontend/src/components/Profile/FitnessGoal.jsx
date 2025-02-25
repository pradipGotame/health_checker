import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function FreeSolo({ value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value); // 让父组件更新 value
  };
  return (
    <Stack spacing={2} sx={{ width: "80%", minWidth: 215 }}>
      <Autocomplete
        freeSolo
        id="firness-goal"
        disableClearable
        options={fitnessGoal.map((option) => option.title)}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search/Select your Goal"
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

const fitnessGoal = [
  { title: 'lose weight' },
  { title: 'gain muscle' },
  { title: 'maintain weight' },
  { title: 'improve endurance' },
  { title: 'improve flexibility' },
];
