import React, { FC } from 'react';

import { makeStyles } from '@material-ui/styles';

import { COLORS, SHADES } from '../../utils/materialColors';

interface IProps {
  item: any;
  onSelection: any;
}

const ColorPicker: FC<IProps> = ({ item, onSelection }: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {COLORS.map((color, colorIndex) => (
        <div key={colorIndex} className={classes.colorRow}>
          {SHADES.map((shade, shadeIndex) => (
            <div
              key={`${colorIndex}-${shadeIndex}`}
              className={[
                classes.color,
                item.color === color.color[shade] ? classes.selected : '',
              ].join(' ')}
              style={{ backgroundColor: color.color[shade] || 'transparent' }}
              onClick={() => onSelection(color.color[shade], color.name, shade)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
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
