import { Box } from '@material-ui/core';
import * as React from 'react';
import { UtsCenter } from '../../../components/UtsCenter';

const PopupInfo: React.FC = ({ children }) => {
  return (
    <UtsCenter>
      <Box className="popup-info">
        {children}
      </Box>
    </UtsCenter>
  );
};

export { PopupInfo };