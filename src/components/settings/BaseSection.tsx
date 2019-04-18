import * as React from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const BaseSection = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" className={classes.title}>
        {props.title}
      </Typography>
      {props.children}
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
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
}));

export default BaseSection;
