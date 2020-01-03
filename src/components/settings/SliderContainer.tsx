import React, { FC } from 'react';
import { makeStyles } from '@material-ui/styles';

interface IProps {
  children: any;
}

const SliderContainer: FC<IProps> = ({ children }: IProps) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    position: 'relative',
    // display: 'flex',
    margin: theme.spacing(0, 1, 2, 1),
  },
}));

export default SliderContainer;
