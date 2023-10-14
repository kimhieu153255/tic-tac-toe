import PropTypes from "prop-types";

const Square = ({ value, onPlay, isPaint }) => {
  return (
    <div
      className={
        `border ring-1 ring-black border-black w-40 h-40 inline-block text-center text-9xl font-bold cursor-pointer hover:bg-gray-300 transition duration-300 ease-in-out text-9 ` +
        (value === "X" ? "text-red-500" : "text-blue-500") +
        (isPaint ? " bg-green-300" : "")
      }
      onClick={onPlay}
    >
      <span className="block relative top-1/2 transform -translate-y-1/2">
        {value}
      </span>
    </div>
  );
};

Square.propTypes = {
  value: PropTypes.string,
  onPlay: PropTypes.func,
  isPaint: PropTypes.bool,
};

export default Square;
