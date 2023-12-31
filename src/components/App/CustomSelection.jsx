import { useEffect, useState } from "react";
import "../../assets/scss/components/custom-selection.scss";
import PropTypes from "prop-types";

const CustomSelection = function (props) {
  const [dropActive, setDropActive] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    props.selectedOptionIndex
  );

  const callBackForClickHandle = () => setDropActive(false);

  useEffect(() => {
    window.addEventListener("click", callBackForClickHandle);

    return () => {
      window.removeEventListener("click", callBackForClickHandle);
    };
  }, []);

  function customSelectionOnClick(e) {
    e.stopPropagation();

    setDropActive(!dropActive);
  }

  function optionOnClick(event, idx, option) {
    setSelectedOptionIndex(idx);

    props.onSelect(event, option);
  }

  return (
    <div
      onClick={customSelectionOnClick}
      className={
        "custom-selection" + (dropActive ? " custom-selection_active" : "")
      }
    >
      <div className="custom-selection__selected-option-text">
        {props.options[selectedOptionIndex].text}
      </div>
      <div className="custom-selection__options">
        {props.options.map((option, idx) => (
          <div
            onClick={(event) => optionOnClick(event, idx, option)}
            key={idx}
            className="custom-selection__option"
          >
            {option.text ? option.text : "text"}
          </div>
        ))}
      </div>
    </div>
  );
};

CustomSelection.propTypes = {
  onSelect: PropTypes.func,
  selectedOptionIndex: PropTypes.number,
  options: PropTypes.array,
};

CustomSelection.defaultProps = {
  onSelect: function () {},
  selectedOptionIndex: 0,
  options: [{ value: "option1", text: "option 1" }],
};

export default CustomSelection;
