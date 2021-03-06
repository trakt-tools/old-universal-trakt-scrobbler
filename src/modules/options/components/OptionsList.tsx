import { List } from '@material-ui/core';
import * as React from 'react';
import { OptionsListItem } from './OptionsListItem';

interface OptionsListProps {
  options: Option[]
}

const OptionsList: React.FC<OptionsListProps> = ({ options }) => (
  <List>
    {options.map(option => (
      <OptionsListItem
        key={option.id}
        option={option}
      />
    ))}
  </List>
);

export { OptionsList };