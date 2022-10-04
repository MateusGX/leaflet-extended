import React from "react";
import PropTypes from 'prop-types';

const PopupSelector = ({ multiIdentifier, Popup, data, selectedOption }) => {
  return (
    <>
      {
        (data[multiIdentifier] === selectedOption) && <Popup data={data} />
      }
    </>
  );
};

PopupSelector.propTypes = {
  multiIdentifier: PropTypes.string.isRequired,
  Popup: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  selectedOption: PropTypes.string
}

PopupSelector.defaultProps = {
  selectedOption: ''
}


export default PopupSelector;