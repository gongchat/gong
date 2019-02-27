import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setTheme } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// interfaces
import IStates from 'src/interfaces/IStates';

// components
import ColorPicker from './ColorPicker';

const ITEMS = [
  {
    group: 'Color',
    type: 'Primary',
    color: '',
    themeKey: 'palette.primary.main',
  },
  {
    group: 'Color',
    type: 'Secondary',
    color: '',
    themeKey: 'palette.secondary.main',
  },
  {
    group: 'Background',
    type: 'Header and Footer',
    color: '',
    themeKey: 'palette.backgroundAccent',
  },
  {
    group: 'Background',
    type: ' Chat',
    color: '',
    themeKey: 'palette.background.paper',
  },
  {
    group: 'Background',
    type: 'Sidebars',
    color: '',
    themeKey: 'palette.background.default',
  },
  {
    group: 'Background',
    type: 'Input',
    color: '',
    themeKey: 'palette.backgroundInput',
  },
  {
    group: 'Text',
    type: 'Primary',
    color: '',
    themeKey: 'palette.text.primary',
  },
  {
    group: 'Text',
    type: 'Secondary',
    color: '',
    themeKey: 'palette.text.secondary',
  },
];

class Theme extends React.Component<any, any> {
  public state = {
    items: ITEMS,
    selectedItem: ITEMS[0],
  };

  constructor(props: any) {
    super(props);

    this.state.items = this.getItemsFromTheme(props.theme);
    this.state.selectedItem = this.state.items[0];
  }

  public componentDidUpdate(prevProps: any) {
    if (this.props.theme !== prevProps.theme) {
      this.setState({ items: this.getItemsFromTheme(prevProps.theme) });
    }
  }

  public render() {
    const { classes } = this.props;
    const { items, selectedItem } = this.state;

    return (
      <React.Fragment>
        <List className={classes.list}>
          {items.map((item: any) => (
            <ListItem
              key={`${item.group}-${item.type}`}
              button={true}
              selected={
                item.group === selectedItem.group &&
                item.type === selectedItem.type
              }
              onClick={() => this.handleClickItem(item)}
            >
              <ListItemText
                className={classes.itemText}
                primary={item.group}
                secondary={item.type}
              />
              <span
                className={classes.preview}
                style={{ backgroundColor: item.color }}
              />
            </ListItem>
          ))}
        </List>
        <div className={classes.picker}>
          <ColorPicker
            item={selectedItem}
            onSelection={this.handleClickColor}
          />
        </div>
      </React.Fragment>
    );
  }

  private handleClickColor = (color: string, name: string, shade: string) => {
    const updatedItem = {
      ...this.state.selectedItem,
      name,
      shade,
      value: color,
    };
    this.setState({ selectedItem: { ...this.state.selectedItem, color } });
    this.props.setTheme(updatedItem);
  };

  private handleClickItem = (item: any) => {
    this.setState({ selectedItem: item });
  };

  private getItemsFromTheme = (theme: any) => {
    return ITEMS.map(item => {
      const props = item.themeKey.split('.');
      const lastProp = props[props.length - 1];

      let currentProp = theme;
      for (const prop of props) {
        if (currentProp[prop] && prop !== lastProp) {
          currentProp = currentProp[prop];
        }
      }

      return {
        ...item,
        color: currentProp[lastProp],
      };
    });
  };
}

const mapStateToProps = (states: IStates) => ({
  theme: states.gong.theme,
});

const mapDispatchToProps = {
  setTheme,
};

const styles: any = (theme: any) => ({
  itemText: {
    fontSize: '9px',
  },
  list: {
    maxWidth: '190px',
    overflowY: 'auto',
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit}px`,
  },
  picker: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: `${theme.spacing.unit * 5}px ${theme.spacing.unit * 2}px`,
  },
  preview: {
    width: theme.spacing.unit * 2,
    height: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    flexShrink: 0,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Theme));
