import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';

// utils
import MaterialColors from 'src/utils/materialColors';

class ColorPicker extends React.Component<any, any> {
  public state = {
    selectedColor: this.props.selectedColor,
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {MaterialColors.colors.map((color, colorIndex) => (
          <div key={colorIndex} className={classes.colorRow}>
            {MaterialColors.shades.map((shade, shadeIndex) => (
              <div
                key={`${colorIndex}-${shadeIndex}`}
                className={classes.color}
                style={{ backgroundColor: color.color[shade] || 'transparent' }}
                onClick={() =>
                  this.handleClickColor(color.color[shade], color.name, shade)
                }
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  private handleClickColor = (color: string, name: string, shade: string) => {
    this.setState({ selectedColor: color });
    const updatedItem = { ...this.props.item, name, shade, value: color };
    this.props.setTheme(updatedItem);
  };
}

const mapDispatchToProps = {
  setTheme,
};

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
    '&:hover': {
      borderRadius: '7px',
      transition: 'ease 0.5s',
      cursor: 'pointer',
    },
  },
  shade: {
    width: '25px',
    fontSize: '8px',
    textAlign: 'center',
    // padding: 0,
    // margin: 0,
  },
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(ColorPicker));
