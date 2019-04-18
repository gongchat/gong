import * as React from 'react';

// material ui
import { makeStyles } from '@material-ui/styles';

const GithubIcon = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.gongContainer}>
      <div className={classes.gong}>
        <div className={[classes.wave, classes.delay1].join(' ')} />
        <div className={[classes.wave, classes.delay2].join(' ')} />
        <div className={[classes.wave, classes.delay3].join(' ')} />
        <div className={[classes.wave, classes.delay4].join(' ')} />
        <div className={classes.gongOutter} />
        <div className={classes.gongInner} />
      </div>
    </div>
  );
};

const useStyles = makeStyles(
  (theme: any): any => ({
    gongContainer: {
      position: 'relative',
      height: '24px',
      width: '24px',
      transform: 'translateY(50%)',
    },
    gong: {
      position: 'relative',
      margin: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'gong 5s linear',
      animationIterationCount: 'infinite',
      zIndex: '2',
    },
    gongOutter: {
      height: '20px',
      width: '20px',
      borderRadius: '50%',
      background: 'gold',
      position: 'absolute',
      zIndex: '-1',
    },
    gongInner: {
      background: '#ffe900',
      height: '10px',
      width: '10px',
      borderRadius: '50%',
      position: 'absolute',
    },
    wave: {
      height: '9px',
      width: '9px',
      borderRadius: '50%',
      background: '#f7d600',
      transition: '5s ease',
      position: 'absolute',
    },
    delay1: {
      animation: 'waves 5s 0.5s linear',
      animationIterationCount: 'infinite',
    },
    delay2: {
      animation: 'waves 5s linear 1.3s forwards',
      animationIterationCount: 'infinite',
    },
    delay3: {
      animation: 'waves 5s linear 1.9s forwards',
      animationIterationCount: 'infinite',
    },
    delay4: {
      animation: 'waves 5s linear 2.5s forwards',
      animationIterationCount: 'infinite',
    },
    '@keyframes gong': {
      '0%': {
        transform: 'translate(0, 0)',
      },
      '2%': {
        transform: 'translate(-1px, 0)',
      },
      '3%': {
        transform: 'translate(0, -1px)',
      },
      '4%': {
        transform: 'translate(1px, 0)',
      },
      '5%': {
        transform: 'translate(0, 1px)',
      },
      '6%, 100%': {
        transform: 'translate(0, 0)',
      },
    },
    '@keyframes waves': {
      '0%': {
        transform: 'scale(1)',
        opacity: 1,
      },
      '50%, 100%': {
        transform: 'scale(3)',
        opacity: 0,
      },
    },
  })
);

export default GithubIcon;
