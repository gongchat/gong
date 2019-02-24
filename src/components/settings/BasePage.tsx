import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

class BasePage extends React.Component<any, any> {
  public render() {
    const { classes, title, children } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h6" className={classes.title}>
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
    padding: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  title: {
    paddingBottom: theme.spacing.unit * 2,
    textTransform: 'uppercase',
  },
});

export default withStyles(styles)(BasePage);
