import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup() {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    console.log("Selected Value:", event.target.value); // 添加日志检查
    setSelectedValue(event.target.value);
    };
    

  return (
    <FormControl>
      <FormLabel id="genderSelect" sx={{ display: "flex"}}>Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby="genderSelect"
        name="gender"
        value={selectedValue}  // 绑定 value
        onChange={handleChange} // 绑定 onChange 事件
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
}
