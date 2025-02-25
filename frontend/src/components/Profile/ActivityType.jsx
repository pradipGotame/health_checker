import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

const activityTypes = [
  'Running',
  'Swimming',
  'Cycling',
  'Weight Training',
  'Yoga',
  'Basketball',
  'Football',
  'Tennis',
  'Dancing',
  'Hiking'
];

export default function ActivityType({ value = [], onChange }) {
  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <Autocomplete
      multiple
      value={safeValue}
      onChange={(event, newValue) => {
        onChange(newValue || []);  // Ensure we always pass an array
      }}
      options={activityTypes}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Activity Types"
          placeholder="Select activities"
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        (tagValue || []).map((option, index) => (
          <Chip
            label={option}
            {...getTagProps({ index })}
            key={option}
          />
        ))
      }
    />
  );
}
