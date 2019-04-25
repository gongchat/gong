import React from 'react';
import { useState } from 'react';

// material ui
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const UserDetail = (props: any) => {
  const classes = useStyles();
  const [index, setIndex] = useState(0);

  const handleOnTabChange = (event: any, value: number) => {
    setIndex(value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {props.user.vCard && props.user.vCard.photo ? (
          <Avatar
            className={classes.avatar}
            src={`data:${props.user.vCard.photoType};base64,${
              props.user.vCard.photo
            }`}
          />
        ) : (
          <Avatar className={classes.avatar} />
        )}
        <div className={classes.headerText}>
          <Typography variant="h6">{props.user.username}</Typography>
          <Typography>{props.user.jid.split('@')[1]}</Typography>
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
        {index === 0 && props.user.vCard && (
          <React.Fragment>
            <div>
              {props.user.vCard.fullName && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Name</Typography>
                  <Typography>{props.user.vCard.fullName}</Typography>
                </div>
              )}
              {props.user.vCard.nickname && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Nickname</Typography>
                  <Typography>{props.user.vCard.nickname}</Typography>
                </div>
              )}
              {props.user.vCard.description && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Description</Typography>
                  <Typography>{props.user.vCard.description}</Typography>
                </div>
              )}
              {props.user.vCard.birthday && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Birthday</Typography>
                  <Typography>{props.user.vCard.birthday}</Typography>
                </div>
              )}
            </div>
            <div>
              {props.user.vCard.organizationName && (
                <div className={classes.section}>
                  <Typography className={classes.name}>
                    Organization Name
                  </Typography>
                  <Typography>{props.user.vCard.organizationName}</Typography>
                </div>
              )}
              {props.user.vCard.organizationUnit && (
                <div className={classes.section}>
                  <Typography className={classes.name}>
                    Organization Unit
                  </Typography>
                  <Typography>{props.user.vCard.organizationUnit}</Typography>
                </div>
              )}
              {props.user.vCard.title && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Title</Typography>
                  <Typography>{props.user.vCard.title}</Typography>
                </div>
              )}
              {props.user.vCard.role && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Role</Typography>
                  <Typography>{props.user.vCard.role}</Typography>
                </div>
              )}
            </div>
          </React.Fragment>
        )}
        {index === 1 && props.user.vCard && (
          <React.Fragment>
            <div>
              {props.user.vCard.url && (
                <div className={classes.section}>
                  <Typography className={classes.name}>URL</Typography>
                  <Link href={props.user.vCard.url} target="_blank">
                    {props.user.vCard.url}
                  </Link>
                </div>
              )}
              {props.user.vCard.phoneNumber && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Phone #</Typography>
                  <Link
                    href={`tel:${props.user.vCard.phoneNumber}`}
                    target="_blank"
                  >
                    {props.user.vCard.phoneNumber}
                  </Link>
                </div>
              )}
              {props.user.vCard.email && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Email</Typography>
                  <Link
                    href={`mailto:${props.user.vCard.email}`}
                    target="_blank"
                  >
                    {props.user.vCard.email}
                  </Link>
                </div>
              )}
            </div>
            <div>
              {(props.user.vCard.street ||
                props.user.vCard.streetExtended ||
                props.user.vCard.city ||
                props.user.vCard.state ||
                props.user.vCard.zipCode) && (
                <div className={classes.section}>
                  <Typography className={classes.name}>Address</Typography>
                  <Typography>
                    {props.user.vCard.street}
                    {props.user.vCard.streetExtended ? (
                      <span>
                        <br />
                        {props.user.vCard.streetExtended}
                      </span>
                    ) : (
                      ''
                    )}
                    {props.user.vCard.city ||
                    props.user.vCard.state ||
                    props.user.vCard.zipCode ? (
                      <span>
                        <br />
                        {props.user.vCard.city
                          ? props.user.vCard.city + ', '
                          : ''}{' '}
                        {props.user.vCard.state} {props.user.zipCode}
                      </span>
                    ) : (
                      ''
                    )}
                  </Typography>
                </div>
              )}
            </div>
          </React.Fragment>
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
