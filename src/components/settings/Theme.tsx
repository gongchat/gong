import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/styles';

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

const Theme: React.FC = () => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const { theme } = context;
  const { setTheme } = actions;

  const [items, setItems] = useState(ITEMS);
  const [selectedItem, setSelectedItem] = useState(ITEMS[0]);

  const handleClickColor = (color: string, name: string, shade: string) => {
    const updatedItem = {
      ...selectedItem,
      name,
      shade,
      value: color,
    };
    setSelectedItem({ ...selectedItem, color });
    setTheme(updatedItem);
  };

  const getItemsFromTheme = (theme: any) => {
    return ITEMS.map(item => {
      const themeProps = item.themeKey.split('.');
      const lastProp = themeProps[themeProps.length - 1];

      let currentProp = theme;
      for (const prop of themeProps) {
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

  React.useEffect(() => {
    setItems(getItemsFromTheme(theme));
  }, [theme]);

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
            onClick={() => setSelectedItem(item)}
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
        <ColorPicker item={selectedItem} onSelection={handleClickColor} />
      </div>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: any) => ({
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
}));

export default Theme;
