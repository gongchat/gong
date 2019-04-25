import React from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const BasePage = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {props.title}
      </Typography>
      {props.children}
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    marginTop: theme.spacing.unit,
    marginLeft: '16px', // leave hard coded for when spacing is set to 0
    padding: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  title: {
    paddingBottom: theme.spacing.unit * 2,
    textTransform: 'uppercase',
  },
}));

export default BasePage;
