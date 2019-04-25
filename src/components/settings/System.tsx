import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

// material ui
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// interface
import BasePage from './BasePage';
import BaseSection from './BaseSection';

const System = (props: any) => {
  const [context, actions] = useContext();

  const [minimizeToTrayOnClose, setMinimizeToTrayOnClose] = useState(
    context.settings.minimizeToTrayOnClose
  );

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    actions.setSettings({ [event.target.name]: value });
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
