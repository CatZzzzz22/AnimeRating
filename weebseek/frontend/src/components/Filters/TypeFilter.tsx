import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { TypeOptions } from "../../types";

interface Props {
  selectedType: string;
  onChange: (type: string) => void;
};

const TypeFilter = ({
  selectedType,
  onChange,
}: Props) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="type-filter-label">Type</InputLabel>
      <Select
        labelId="type-filter-label"
        value={selectedType}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value="">All Types</MenuItem>
        {TypeOptions.map((t) => (
          <MenuItem key={t} value={t}>
            {t}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TypeFilter;
