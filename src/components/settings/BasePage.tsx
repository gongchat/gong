import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  title: string;
  children: any;
}

const BasePage: React.FC<IProps> = (props: IProps) => {
  const classes = useStyles();

  const { title, children } = props;

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {children}
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
