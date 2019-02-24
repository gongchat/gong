import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class SliderMarkers extends React.Component<any, any> {
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.markers}>{this.getMarkers()}</div>
      </div>
    );
  }

  private getMarkers = () => {
    const { classes, minSize, maxSize, defaultSize } = this.props;
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
          {i === minSize && <Typography>{minSize}</Typography>}
          {i === defaultSize && <Typography>{defaultSize}</Typography>}
          {i === maxSize && <Typography>{maxSize}</Typography>}
        </div>
      );
    }
    return markers;
  };
}

const styles: any = (theme: any) => ({
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
});

export default withStyles(styles)(SliderMarkers);
