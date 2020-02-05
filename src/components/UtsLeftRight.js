import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

function UtsLeftRight({ left, right }) {
  return (
    <Box classes={{ root: 'container--left-right' }}>
      <Box>{left}</Box>
      <Box>{right}</Box>
    </Box>
  );
}

UtsLeftRight.propTypes = {
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired,
};

export { UtsLeftRight };