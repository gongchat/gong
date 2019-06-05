import React, { FC, useState, useEffect } from 'react';
import { useContext } from '../../context';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/styles';

import ColorPicker from './ColorPicker';
import MiniGong from './MiniGong';

const ITEMS = [
  {
    group: 'Color',
    type: 'Primary',
    color: '',
    themeKey: 'palette.primary.main',
    defaultProps: {
      name: 'cyan',
      shade: '500',
      value: '#00bcd4',
    },
  },
  {
    group: 'Color',
    type: 'Secondary',
    color: '',
    themeKey: 'palette.secondary.main',
    defaultProps: {
      name: 'orange',
      shade: '500',
      value: '#ff9100',
    },
  },
  {
    group: 'Background',
    type: 'Header and Footer',
    color: '',
    themeKey: 'palette.backgroundAccent',
    defaultProps: {
      value: '#222222',
    },
  },
  {
    group: 'Background',
    type: ' Chat',
    color: '',
    themeKey: 'palette.background.paper',
    defaultProps: {
      value: '#424242',
    },
  },
  {
    group: 'Background',
    type: 'Sidebars',
    color: '',
    themeKey: 'palette.background.default',
    defaultProps: {
      value: '#303030',
    },
  },
  {
    group: 'Background',
    type: 'Input',
    color: '',
    themeKey: 'palette.backgroundInput',
    defaultProps: {
      value: '#555555',
    },
  },
  {
    group: 'Text',
    type: 'Primary',
    color: '',
    themeKey: 'palette.text.primary',
    defaultProps: {
      value: '#fff',
    },
  },
  {
    group: 'Text',
    type: 'Secondary',
    color: '',
    themeKey: 'palette.text.secondary',
    defaultProps: {
      value: 'rgba(255, 255, 255, 0.7)',
    },
  },
];

const Theme: FC = () => {
  const classes = useStyles();
  const [{ theme }, { setTheme }] = useContext();
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
    setTheme([updatedItem]);
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

  const reset = () => {
    setTheme(
      ITEMS.map(item => {
        return {
          themeKey: item.themeKey,
          ...item.defaultProps,
        };
      })
    );
  };

  useEffect(() => {
    setItems(getItemsFromTheme(theme));
  }, [theme]);

  return (
    <>
      <div className={classes.left}>
        <div className={classes.miniGong}>
          <MiniGong />
        </div>
        <div className={classes.listing}>
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
            <Divider />
            <ListItem button={true} onClick={reset}>
              RESET
            </ListItem>
          </List>
        </div>
      </div>
      <div className={classes.picker}>
        <ColorPicker item={selectedItem} onSelection={handleClickColor} />
      </div>
    </>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  left: {
    position: 'relative',
    maxWidth: '190px',
    overflowY: 'auto',
    padding: theme.spacing(5, 1),
  },
  itemText: {
    fontSize: '9px',
  },
  list: {},
  picker: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: theme.spacing(5, 2),
  },
  preview: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginLeft: theme.spacing(2),
    flexShrink: 0,
  },
  miniGong: {
    position: 'fixed',
    zIndex: 9999,
  },
  listing: {
    marginTop: '150px', // same height as the miniGong(125px) + some spacing
  },
}));

export default Theme;
