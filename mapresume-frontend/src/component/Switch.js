import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function Switch({onClickFunction}) {
    const [param, setParam] = React.useState(0);
  
    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setParam(value);
      onClickFunction(value);
    };
  
    return (
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Params</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={param}
          label="Params"
          onChange={handleChange}
        >
          <MenuItem value={0}>
            <em>None</em>
          </MenuItem>
          <MenuItem value={1}>applies&views</MenuItem>
          <MenuItem value={2}>company_size&followers</MenuItem>
          <MenuItem value={3}>max_salary&followers</MenuItem>
          <MenuItem value={4}>max_salary&views</MenuItem>
          <MenuItem value={5}>max_salary&applies</MenuItem>


        </Select>
        <FormHelperText>Choose your parameters</FormHelperText>
      </FormControl>
      </div>
    );
  }