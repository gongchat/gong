import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import BasePage from './BasePage';
import BaseSection from './BaseSection';
import { DEFAULT as DEFAULT_SETTINGS } from '../../actions/settings';

const Messages: FC = () => {
  const [{ settings }, { setAndSaveSettings }] = useContext();
  const [renderVideos, setRenderVideos] = useState(settings.renderVideos);
  const [renderGetYarn, setRenderGetYarn] = useState(settings.renderGetYarn);
  const [renderImages, setRenderImages] = useState(settings.renderImages);

  const handleOnChange = (event: any, value: any, action: any) => {
    action(value);
    setAndSaveSettings({ [event.target.name]: value });
  };

  const reset = () => {
    setAndSaveSettings({
      renderVideos: DEFAULT_SETTINGS.renderVideos,
      renderGetYarn: DEFAULT_SETTINGS.renderGetYarn,
      renderImages: DEFAULT_SETTINGS.renderImages,
    });
  };

  useEffect(() => {
    setRenderVideos(settings.renderVideos);
  }, [settings.renderVideos]);

  useEffect(() => {
    setRenderGetYarn(settings.renderGetYarn);
  }, [settings.renderGetYarn]);

  useEffect(() => {
    setRenderImages(settings.renderImages);
  }, [settings.renderImages]);

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
      <div>
        <Button color="secondary" onClick={reset} variant="outlined">
          RESET
        </Button>
      </div>
    </BasePage>
  );
};

export default Messages;
