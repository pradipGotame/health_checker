import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup({ value, onChange }) {
  const handleChange = (event) => {
    console.log("Selected Value:", event.target.value); // 添加日志检查
    onChange(event.target.value); // 让父组件更新 value
  };

  return (
    <FormControl>
      <FormLabel id="genderSelect" sx={{ display: "flex", color: "text.primary" }}>
        Gender
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="genderSelect"
        name="gender"
        value={value}
        onChange={handleChange}
        sx={{ padding: 1 }}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
}
