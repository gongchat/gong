import React, { FC } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  title: string;
  children: any;
}

const BaseSection: FC<IProps> = ({ title, children }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2" className={classes.title}>
        {title}
      </Typography>
      {children}
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    '& > *': {
      marginBottom: theme.spacing(2),
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
