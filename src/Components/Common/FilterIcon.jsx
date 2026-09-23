import React from "react";
import PropTypes from "prop-types";

const FilterIcon = ({ size = 16, color = "currentColor", filled = false }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? color : "none"}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "inline-block", verticalAlign: "middle" }}
            aria-hidden="true"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
};

FilterIcon.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    filled: PropTypes.bool,
};

export default FilterIcon;
