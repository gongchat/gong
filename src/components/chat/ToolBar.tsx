import React, { FC, useEffect, useState, useRef } from 'react';
import { useContext } from '../../context';

import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';

import IRoom from '../../interfaces/IRoom';
import IUser from '../../interfaces/IUser';
import IUserConnection from '../../interfaces/IUserConnection';
import Status from './Status';

const ToolBar: FC = () => {
  const classes = useStyles();
  const [
    { current, settings },
    { setSessionJid, setSearchText },
  ] = useContext();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [searchTextLocal, setSearchTextLocal] = useState(
    current ? current.searchText : ''
  );
  const [anchorEl, setAnchorEl] = useState<any | null>(null);

  const searchTimer = useRef<any>();
  const searchRef = useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);

  const handleSessionClick = (event: React.MouseEvent<any, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSessionClose = () => {
    setAnchorEl(null);
  };

  const handleSessionSelection = (jid: string) => {
    if (current) {
      setSessionJid(current.jid, jid);
      handleSessionClose();
    }
  };

  const handleSearchOnChange = (event: any) => {
    const newSearchValue = event.target.value;
    setSearchTextLocal(newSearchValue);
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => {
      if (current) {
        setSearchText(current.jid, newSearchValue);
      }
    }, 1000);
  };

  const handleSearchClear = () => {
    setSearchTextLocal('');
    if (current) {
      setSearchText(current.jid, '');
    }
  };

  useEffect(() => {
    const handleFind = (event: any) => {
      if (event.ctrlKey && event.key === 'f') {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleFind);

    return () => {
      window.removeEventListener('keydown', handleFind);
    };
  }, []);

  useEffect(() => {
    if (current) {
      switch (current.type) {
        case 'groupchat':
          const room = current as IRoom;
          setName(
            current.name.startsWith('#') && current.name.length > 1
              ? current.name.substring(1)
              : current.name
          );
          setStatus(room.isConnected ? 'online' : 'offline');
          break;
        case 'chat':
          const user = current as IUser;
          setName(
            user.vCard && user.vCard.fullName ? user.vCard.fullName : user.name
          );
          setStatus(user.status);
          setSessionName(user.sessionJid ? user.sessionJid.split('/')[1] : '');
          break;
        default:
          break;
      }
    } else {
      setName('');
      setStatus('');
      setSessionName('');
    }
  }, [current]);

  useEffect(() => {
    if (current) {
      setSearchTextLocal(current.searchText);
    }
  }, [current]);

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <Typography>{settings.domain}</Typography>
      </div>
      <div className={classes.right}>
        <Typography>
          <span className={classes.symbol}>
            {current && current.type === 'groupchat' && '# '}
            {current && current.type === 'chat' && '@ '}
          </span>
          {name}
        </Typography>
        {current &&
          current.type === 'groupchat' &&
          (current as IRoom).connectionError && (
            <Typography color="error">
              ({(current as IRoom).connectionError})
            </Typography>
          )}
        {current && current.type === 'chat' && current.order !== 10 && (
          <>
            <Status status={status} />
            {sessionName && (
              <>
                <div className={classes.divider} />
                <Typography
                  className={classes.sessionJid}
                  color="textSecondary"
                  variant="caption"
                  onClick={handleSessionClick}
                >
                  {sessionName}
                </Typography>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleSessionClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {(current as IUser).connections.map(
                    (connection: IUserConnection, index: number) => (
                      <MenuItem
                        key={connection.jid + '-' + index}
                        onClick={() => handleSessionSelection(connection.jid)}
                      >
                        <div className={classes.menuItemStatus}>
                          <Status status={connection.status} />
                        </div>
                        {connection.jid.split('/')[1]}
                      </MenuItem>
                    )
                  )}
                </Popover>
              </>
            )}
          </>
        )}
        <div className={classes.filler} />
        {current && (
          <div>
            <InputBase
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon className={classes.inputIcon} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <CloseIcon
                    onClick={handleSearchClear}
                    className={[
                      classes.inputIcon,
                      classes.clickableIcon,
                      searchTextLocal !== '' ? '' : classes.hideIcon,
                    ].join(' ')}
                  />
                </InputAdornment>
              }
              placeholder="Search"
              value={searchTextLocal}
              onChange={handleSearchOnChange}
              className={classes.inputBase}
              inputProps={{ ref: searchRef, className: classes.input }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    backgroundColor: theme.palette.background.default,
  },
  left: {
    width: theme.sidebarWidth,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing(2),
    flexShrink: 0,
    '& p': {
      fontWeight: 'bold',
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  right: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& p': {
      paddingRight: theme.spacing(1),
    },
  },
  filler: {
    flexGrow: 1,
  },
  symbol: {
    opacity: 0.5,
  },
  divider: {
    height: '75%',
    borderLeft: `1px solid ${theme.palette.divider}`,
    marginLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  sessionJid: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  menuItemStatus: {
    paddingRight: theme.spacing(),
  },
  inputBase: {
    background: theme.palette.background.default,
    padding: theme.spacing(0.5),
  },
  input: {
    fontSize: '0.9rem',
    padding: 0,
    width: 100,
    transition: '100ms ease-out',
    '&:focus': {
      width: 150,
    },
  },
  inputIcon: {
    height: '0.9rem',
    width: '0.9rem',
  },
  clickableIcon: {
    cursor: 'pointer',
  },
  hideIcon: {
    opacity: 0,
  },
}));

export default ToolBar;
