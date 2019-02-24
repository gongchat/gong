import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class BaseSection extends React.Component<any, any> {
  public render() {
    const { classes, title, children } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="subtitle2" className={classes.title}>
          {title}
        </Typography>
        {children}
      </div>
    );
  }
}

const styles: any = (theme: any) => ({
  root: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginBottom: theme.spacing.unit * 2,
      width: '500px',
    },
    '& input': {
      minWidth: '300px',
    },
    '& input[type="number"]': {
      textAlign: 'right',
    },
  },
  title: {
    textTransform: 'uppercase',
  },
});

export default withStyles(styles)(BaseSection);
