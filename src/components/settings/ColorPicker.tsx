import * as React from 'react';

// material ui
import { withStyles } from '@material-ui/core';

// utils
import MaterialColors from 'src/utils/materialColors';

class ColorPicker extends React.Component<any, any> {
  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {MaterialColors.colors.map((color, colorIndex) => (
          <div key={colorIndex} className={classes.colorRow}>
            {MaterialColors.shades.map((shade, shadeIndex) => (
              <div
                key={`${colorIndex}-${shadeIndex}`}
                className={[
                  classes.color,
                  this.props.item.color === color.color[shade]
                    ? classes.selected
                    : '',
                ].join(' ')}
                style={{ backgroundColor: color.color[shade] || 'transparent' }}
                onClick={() =>
                  this.props.onSelection(color.color[shade], color.name, shade)
                }
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

const styles: any = (theme: any) => ({
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
});

export default withStyles(styles)(ColorPicker);
