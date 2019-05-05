import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import BasePage from './BasePage';
import BaseSection from './BaseSection';

const System: React.FC = () => {
  const [{ settings }, { setAndSaveSettings }] = useContext();
  const [minimizeToTrayOnClose, setMinimizeToTrayOnClose] = useState(
    settings.minimizeToTrayOnClose
  );

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    setAndSaveSettings({ [event.target.name]: value });
  };

  return (
    <BasePage title="System">
      <BaseSection title="On Close">
        <FormControlLabel
          control={
            <Switch
              name="minimizeToTrayOnClose"
              checked={minimizeToTrayOnClose}
              onChange={(event: any, value: any) =>
                handleOnChange(event, value, setMinimizeToTrayOnClose)
              }
            />
          }
          label="Minimize to tray"
        />
      </BaseSection>
    </BasePage>
  );
};

export default System;
