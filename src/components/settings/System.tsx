import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import BasePage from './BasePage';
import BaseSection from './BaseSection';
import { DEFAULT as DEFAULT_SETTINGS } from '../../actions/settings';

const System: FC = () => {
  const [{ settings }, { setAndSaveSettings }] = useContext();
  const [minimizeToTrayOnClose, setMinimizeToTrayOnClose] = useState(
    settings.minimizeToTrayOnClose
  );

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    setAndSaveSettings({ [event.target.name]: value });
  };

  const reset = () => {
    setAndSaveSettings({
      minimizeToTrayOnClose: DEFAULT_SETTINGS.minimizeToTrayOnClose,
    });
  };

  useEffect(() => {
    setMinimizeToTrayOnClose(settings.minimizeToTrayOnClose);
  }, [settings.minimizeToTrayOnClose]);

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
      <div>
        <Button color="secondary" onClick={reset} variant="outlined">
          RESET
        </Button>
      </div>
    </BasePage>
  );
};

export default System;
