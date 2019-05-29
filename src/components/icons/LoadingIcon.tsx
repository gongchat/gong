import React, { FC } from 'react';

import { makeStyles } from '@material-ui/styles';

const LoadingIcon: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.gongContainer}>
        <div className={classes.gongBar} />
        <div className={classes.gongStrings} />
        <div className={classes.gong}>
          <div className={[classes.wave, classes.delay1].join(' ')} />
          <div className={[classes.wave, classes.delay2].join(' ')} />
          <div className={[classes.wave, classes.delay3].join(' ')} />
          <div className={[classes.wave, classes.delay4].join(' ')} />
          <div className={classes.gongOuter} />
          <div className={classes.gongInner} />
        </div>
      </div>
    </div>
  );
};

const useStyles: any = makeStyles(
  (theme: any): any => ({
    root: {
      height: '225px',
    },
    gongContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    gongBar: {
      width: '200px',
      height: '20px',
      background: '#351807',
      position: 'relative',
      zIndex: 1,
    },
    gongStrings: {
      width: '125px',
      height: '125px',
      transform: 'rotate(45deg)',
      borderRight: '3px solid #848484',
      borderBottom: '3px solid #848484',
      marginTop: '-75px',
      marginBottom: '-35px',
      position: 'relative',
    },
    gong: {
      position: 'absolute',
      top: '115px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: '$gong 5s linear',
      animationIterationCount: 'infinite',
      zIndex: 2,
    },
    gongOuter: {
      height: '160px',
      width: '160px',
      borderRadius: '50%',
      background: 'gold',
      position: 'absolute',
      zIndex: -1,
    },
    gongInner: {
      background: '#ffe900',
      height: '80px',
      width: '80px',
      borderRadius: '50%',
      position: 'absolute',
    },
    wave: {
      height: '15px',
      width: '15px',
      borderRadius: '50%',
      background: '#f7d600',
      opacity: 0,
      transition: '5s ease',
      position: 'absolute',
      zIndex: '3',
    },
    delay1: {
      animation: '$waves 5s 0.5s linear',
      animationIterationCount: 'infinite',
    },
    delay2: {
      animation: '$waves 5s linear 1.3s forwards',
      animationIterationCount: 'infinite',
    },
    delay3: {
      animation: '$waves 5s linear 1.9s forwards',
      animationIterationCount: 'infinite',
    },
    delay4: {
      animation: '$waves 5s linear 2.5s forwards',
      animationIterationCount: 'infinite',
    },
    '@keyframes gong': {
      '0%': { transform: 'translate(0, 0)' },
      '2%': { transform: 'translate(-2px, 0)' },
      '3%': { transform: 'translate(0, -2px)' },
      '4%': { transform: 'translate(2px, 0)' },
      '5%': { transform: 'translate(0, 2px)' },
      '6%': { transform: 'translate(0, 0)' },
      '100%': { transform: 'translate(0, 0)' },
    },
    '@keyframes waves': {
      '0%': { transform: 'scale(1)', opacity: 1 },
      '50%': { transform: 'scale(14)', opacity: 0 },
      '100%': { transform: 'scale(14)', opacity: 0 },
    },
  })
);

export default LoadingIcon;
