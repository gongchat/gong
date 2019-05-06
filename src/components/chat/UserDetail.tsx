import React, { useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

import IUser from '../../interfaces/IUser';

interface IProps {
  user: IUser;
}

const UserDetail: React.FC<IProps> = (props: IProps) => {
  const { user } = props;
  const classes = useStyles();
  const [index, setIndex] = useState(0);

  const handleOnTabChange = (event: any, value: number) => {
    setIndex(value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {user.vCard && user.vCard.photo ? (
          <Avatar
            className={classes.avatar}
            src={`data:${user.vCard.photoType};base64,${user.vCard.photo}`}
          />
        ) : (
          <Avatar className={classes.avatar} />
        )}
        <div className={classes.headerText}>
          <Typography variant="h6">{user.username}</Typography>
          <Typography>{user.jid.split('@')[1]}</Typography>
        </div>
      </div>
      <Paper square={true}>
        <Tabs
          value={index}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleOnTabChange}
        >
          <Tab label="User Info" />
          <Tab label="Contact Info" />
        </Tabs>
      </Paper>
      <div className={classes.content}>
        {/* User Info */}
        {index === 0 && user.vCard && (
          <>
            <div>
              {user.vCard.fullName && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Name</Typography>
                  <Typography>{user.vCard.fullName}</Typography>
                </div>
              )}
              {user.vCard.nickname && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Nickname</Typography>
                  <Typography>{user.vCard.nickname}</Typography>
                </div>
              )}
              {user.vCard.description && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Description</Typography>
                  <Typography>{user.vCard.description}</Typography>
                </div>
              )}
              {user.vCard.birthday && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Birthday</Typography>
                  <Typography>{user.vCard.birthday}</Typography>
                </div>
              )}
            </div>
            <div>
              {user.vCard.organizationName && (
                <div className={classes.section}>
                  <Typography className={classes.name}>
                    Organization Name
                  </Typography>
                  <Typography>{user.vCard.organizationName}</Typography>
                </div>
              )}
              {user.vCard.organizationUnit && (
                <div className={classes.section}>
                  <Typography className={classes.name}>
                    Organization Unit
                  </Typography>
                  <Typography>{user.vCard.organizationUnit}</Typography>
                </div>
              )}
              {user.vCard.title && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Title</Typography>
                  <Typography>{user.vCard.title}</Typography>
                </div>
              )}
              {user.vCard.role && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Role</Typography>
                  <Typography>{user.vCard.role}</Typography>
                </div>
              )}
            </div>
          </>
        )}
        {index === 1 && user.vCard && (
          <>
            <div>
              {user.vCard.url && (
                <div className={classes.section}>
                  <Typography className={classes.name}>URL</Typography>
                  <Link href={user.vCard.url} target="_blank">
                    {user.vCard.url}
                  </Link>
                </div>
              )}
              {user.vCard.phoneNumber && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Phone #</Typography>
                  <Link href={`tel:${user.vCard.phoneNumber}`} target="_blank">
                    {user.vCard.phoneNumber}
                  </Link>
                </div>
              )}
              {user.vCard.email && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Email</Typography>
                  <Link href={`mailto:${user.vCard.email}`} target="_blank">
                    {user.vCard.email}
                  </Link>
                </div>
              )}
            </div>
            <div>
              {(user.vCard.street ||
                user.vCard.streetExtended ||
                user.vCard.city ||
                user.vCard.state ||
                user.vCard.zipCode) && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Address</Typography>
                  <Typography>
                    {user.vCard.street}
                    {user.vCard.streetExtended ? (
                      <span>
                        <br />
                        {user.vCard.streetExtended}
                      </span>
                    ) : (
                      ''
                    )}
                    {user.vCard.city ||
                    user.vCard.state ||
                    user.vCard.zipCode ? (
                      <span>
                        <br />
                        {user.vCard.city ? user.vCard.city + ', ' : ''}{' '}
                        {user.vCard.state} {user.vCard.zipCode}
                      </span>
                    ) : (
                      ''
                    )}
                  </Typography>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    minWidth: '500px',
  },
  header: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    backgroundColor: theme.palette.backgroundAccent,
    padding: theme.spacing.unit * 4,
  },
  headerText: {
    marginLeft: theme.spacing.unit * 2,
  },
  avatar: {
    height: '64px',
    width: '64px',
  },
  domain: {
    fontSize: '0.8rem',
    opacity: 0.7,
  },
  content: {
    padding: theme.spacing.unit * 4,
    display: 'flex',
    flexWrap: 'nowrap',
    overflowY: 'auto',
    '& div': {
      flex: '1',
    },
  },
  section: {
    paddingBottom: theme.spacing.unit,
  },
  name: {
    opacity: 0.5,
  },
}));

export default UserDetail;
