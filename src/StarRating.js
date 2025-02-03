import { PropTypes } from "prop-types";
import { useState } from "react";

const starContainer = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const stars = {
  display: "flex",
};

StarRating.propTypes = {
  maxStars: PropTypes.number,
};

export default function StarRating({
  maxStars = 5,
  color = "#ffe234",
  size = 48,
  fontSize = 48,
  messages = [],
  onSetRating,
  defaultRating = 0,
}) {
  const textStyle = {
    margin: "0",
    lineHeight: "1",
    fontSize: `${fontSize}px`,
    color: color,
  };
  const [rating, SetRating] = useState(defaultRating);
  const [hoverRating, SetHoverRating] = useState(0);
  return (
    <div style={starContainer}>
      <div style={stars}>
        {Array.from({ length: maxStars }, (_, i) => (
          <Star
            id={i + 1}
            color={color}
            size={size}
            full={hoverRating ? hoverRating >= i + 1 : rating >= i + 1}
            OnHoverIn={() => SetHoverRating(i + 1)}
            OnHoverOut={() => SetHoverRating(0)}
            key={i + 1}
            onRate={() => {
              SetRating((r) => i + 1);
              onSetRating((r) => i + 1);
            }}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxStars
          ? messages[hoverRating ? hoverRating - 1 : rating - 1]
          : hoverRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, OnHoverIn, OnHoverOut, color, size }) {
  const starstyle = {
    height: `${size}px`,
    width: `${size}px`,
    color: color,
  };
  return (
    <span
      style={starstyle}
      onClick={onRate}
      onMouseEnter={OnHoverIn}
      onMouseLeave={OnHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
