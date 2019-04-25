import * as React from 'react';

// material ui
import { makeStyles } from '@material-ui/styles';

// utils
import MaterialColors from '../../utils/materialColors';

const ColorPicker = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {MaterialColors.colors.map((color, colorIndex) => (
        <div key={colorIndex} className={classes.colorRow}>
          {MaterialColors.shades.map((shade, shadeIndex) => (
            <div
              key={`${colorIndex}-${shadeIndex}`}
              className={[
                classes.color,
                props.item.color === color.color[shade] ? classes.selected : '',
              ].join(' ')}
              style={{ backgroundColor: color.color[shade] || 'transparent' }}
              onClick={() =>
                props.onSelection(color.color[shade], color.name, shade)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  shadeRowHeaders: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  colorRow: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexShrink: 0,
  },
  colorName: {
    width: '75px',
    height: '25px',
    fontSize: '12px',
    textAlign: 'right',
    paddingRight: '5px',
    display: 'flex',
    alignItems: 'center',
  },
  color: {
    width: '25px',
    height: '25px',
    transition: 'ease 0.5s',
    cursor: 'pointer',
    '&:hover': {
      borderRadius: '7px',
    },
  },
  shade: {
    width: '25px',
    fontSize: '8px',
    textAlign: 'center',
  },
  selected: {
    borderRadius: '14px !important',
  },
}));

export default ColorPicker;
