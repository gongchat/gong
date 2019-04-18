import * as React from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const SliderMarkers = (props: any) => {
  const classes = useStyles();
  const getMarkers = () => {
    const markers: any[] = [];
    for (let i = props.minSize; i <= props.maxSize; i++) {
      markers.push(
        <div
          key={i}
          style={{
            width: `${(1.0 / (props.maxSize - props.minSize)) * 500.0}px`,
          }}
          className={classes.marker}
        >
          <span className={classes.dot} />
          {i === props.minSize && <Typography>{props.minSize}</Typography>}
          {i === props.defaultSize && (
            <Typography>{props.defaultSize}</Typography>
          )}
          {i === props.maxSize && <Typography>{props.maxSize}</Typography>}
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

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: '10px',
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
      paddingTop: theme.spacing.unit,
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
