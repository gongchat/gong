import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import BasePage from './BasePage';
import BaseSection from './BaseSection';

const Messages: React.FC = () => {
  const [context, actions] = useContext();

  const { settings } = context;
  const { setSettings } = actions;

  const [renderVideos, setRenderVideos] = useState(settings.renderVideos);
  const [renderGetYarn, setRenderGetYarn] = useState(settings.renderGetYarn);
  const [renderImages, setRenderImages] = useState(settings.renderImages);

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    setSettings({ [event.target.name]: value });
  };

  return (
    <BasePage title="Messages">
      <BaseSection title="Display">
        <FormControlLabel
          control={
            <Switch
              name="renderVideos"
              checked={renderVideos}
              onChange={(event: any, value: any) =>
                handleOnChange(event, value, setRenderVideos)
              }
            />
          }
          label="Show videos"
        />
        <FormControlLabel
          control={
            <Switch
              name="renderGetYarn"
              checked={renderGetYarn}
              onChange={(event: any, value: any) =>
                handleOnChange(event, value, setRenderGetYarn)
              }
            />
          }
          label="Show GetYarn"
        />
        <FormControlLabel
          control={
            <Switch
              name="renderImages"
              checked={renderImages}
              onChange={(event: any, value: any) =>
                handleOnChange(event, value, setRenderImages)
              }
            />
          }
          label="Show images"
        />
      </BaseSection>
    </BasePage>
  );
};

export default Messages;
