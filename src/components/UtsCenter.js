import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

function UtsCenter({ children }) {
  return (
    <Box classes={{ root: 'container--centered' }}>
      {children}
    </Box>
  );
}

UtsCenter.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UtsCenter };