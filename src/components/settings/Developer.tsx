import React, { FC } from 'react';
import { useContext } from '../../context';
import ReactJson from 'react-json-view';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import BasePage from './BasePage';
import BaseSection from './BaseSection';

const Developer: FC = () => {
  const classes = useStyles();
  const [context] = useContext();

  return (
    <BasePage title="Developer">
      <BaseSection title="Commands">
        {(context.app.operatingSystem === 'win32' ||
          context.app.operatingSystem === 'darwin') && (
          <>
            <Typography className={classes.command} variant="body2">
              Open dev tools:
              <span className={classes.keys}>
                <span>Ctrl</span> + <span>Alt</span> + <span>I</span>
              </span>
              or
              <span className={classes.keys}>
                <span>F12</span>
              </span>
            </Typography>
            <Typography className={classes.command} variant="body2">
              Refresh application:
              <span className={classes.keys}>
                <span>Ctrl</span> + <span>R</span>
              </span>
            </Typography>
          </>
        )}
        {context.app.operatingSystem === 'mac' && (
          <>
            <Typography className={classes.command} variant="body2">
              Open dev tools:
              <span className={classes.keys}>
                <span>Cmd</span> + <span>Alt</span> + <span>I</span>
              </span>
              or
              <span className={classes.keys}>
                <span>F12</span>
              </span>
            </Typography>
            <Typography className={classes.command} variant="body2">
              Refresh application:
              <span className={classes.keys}>
                <span>Cmd</span> + <span>R</span>
              </span>
            </Typography>
          </>
        )}
      </BaseSection>
      <BaseSection title="Global State">
        <ReactJson
          src={context}
          theme="monokai"
          collapsed={1}
          collapseStringsAfterLength={200}
          displayDataTypes={false}
          enableClipboard={false} // TODO: Would like to enable the clipboard, but does not work properly
        />
      </BaseSection>
    </BasePage>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  command: {
    display: 'flex',
    alignItems: 'center',
  },
  keys: {
    padding: theme.spacing(0, 1),
    fontSize: '0.8rem',

    '& span': {
      backgroundColor: theme.palette.backgroundAccent,
      padding: theme.spacing(0.5, 1),
    },
  },
}));

export default Developer;
