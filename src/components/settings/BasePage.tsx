import React, { FC } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  title: string;
  children: any;
}

const BasePage: FC<IProps> = ({ title, children }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {children}
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    marginTop: theme.spacing(1),
    marginLeft: '16px', // leave hard coded for when spacing is set to 0
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  title: {
    paddingBottom: theme.spacing(2),
    textTransform: 'uppercase',
  },
}));

export default BasePage;
