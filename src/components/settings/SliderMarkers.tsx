import React, { FC } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  minSize: number;
  maxSize: number;
  defaultSize: number;
  showLabels: null | boolean;
}

const SliderMarkers: FC<IProps> = ({
  minSize,
  maxSize,
  defaultSize,
  showLabels = false,
}: IProps) => {
  const classes = useStyles();

  const getMarkers = () => {
    const markers: any[] = [];
    for (let i = minSize; i <= maxSize; i++) {
      markers.push(
        <div
          key={i}
          style={{
            width: `${(1.0 / (maxSize - minSize)) * 500.0}px`,
          }}
          className={classes.marker}
        >
          <span className={classes.dot} />
          {showLabels && (
            <>
              {i === minSize && <Typography>{minSize}</Typography>}
              {i === defaultSize && <Typography>{defaultSize}</Typography>}
              {i === maxSize && <Typography>{maxSize}</Typography>}
            </>
          )}
        </div>
      );
    }
    return markers;
  };

  return (
    <div className={classes.root}>
      <div className={classes.markers}>{getMarkers()}</div>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    height: 10,
    position: 'absolute',
    top: 14,
  },
  markers: {
    position: 'absolute',
    display: 'flex',
    flexWrap: 'nowrap',
  },
  marker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    '& p': {
      position: 'absolute',
      transform: 'translateX(-50%)',
      paddingTop: theme.spacing(1),
    },
  },
  dot: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    width: 5,
    height: 5,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '50%',
  },
}));

export default SliderMarkers;
