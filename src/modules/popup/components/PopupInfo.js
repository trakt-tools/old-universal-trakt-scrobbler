import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { UtsCenter } from '../../../components/UtsCenter';

function PopupInfo({ children }) {
  return (
    <UtsCenter>
      <Box classes={{ root: 'popup-info' }}>
        {children}
      </Box>
    </UtsCenter>
  );
}

PopupInfo.propTypes = {
  children: PropTypes.node.isRequired,
};

export { PopupInfo };