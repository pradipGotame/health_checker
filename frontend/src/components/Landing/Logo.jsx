import { Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function Logo({ variant, ...props }) {
  return (
    <Typography
      variant={variant || "h5"}
      gutterBottom={props.gutterBottom || false}
      color={props.color || "primary"}
      sx={{
        fontFamily: "Racing Sans One",
      }}
    >
      ActiveX
    </Typography>
  );
}

Logo.propTypes = {
  variant: PropTypes.string,
  gutterBottom: PropTypes.bool,
  color: PropTypes.string,
};
