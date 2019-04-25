import * as React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

// material ui
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// interface
import BasePage from './BasePage';
import BaseSection from './BaseSection';

const Messages = (props: any) => {
  const [context, actions] = useContext();

  const [renderVideos, setRenderVideos] = useState(
    context.settings.renderVideos
  );
  const [renderGetYarn, setRenderGetYarn] = useState(
    context.settings.renderGetYarn
  );
  const [renderImages, setRenderImages] = useState(
    context.settings.renderImages
  );

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    actions.setSettings({ [event.target.name]: value });
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
