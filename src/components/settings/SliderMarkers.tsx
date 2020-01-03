import React, { FC } from 'react';

import { makeStyles } from '@material-ui/styles';

interface IProps {
  size: number;
}

const SliderMarkers: FC<IProps> = ({ size }: IProps) => {
  const classes = useStyles();

  const getMarkers = () => {
    const markers: any[] = [];
    for (let i = 0; i <= size; i++) {
      markers.push(
        <div
          key={i}
          style={{
            width: `${(1.0 / size) * 500.0}px`,
          }}
          className={classes.marker}
        >
          <span className={classes.dot} />
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
