import React from 'react';
import { useState } from 'react';
import { useContext } from '../../context';

import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const Account: React.FC = () => {
  const classes = useStyles();
  const [context, actions] = useContext();

  const { profile } = context;
  const { setMyVCard } = actions;

  const [index, setIndex] = useState(0);
  const [fullName, setFullName] = useState(
    profile.vCard ? profile.vCard.fullName : ''
  );
  const [firstName, setFirstName] = useState(
    profile.vCard ? profile.vCard.firstName : ''
  );
  const [lastName, setLastName] = useState(
    profile.vCard ? profile.vCard.lastName : ''
  );
  const [middleName, setMiddleName] = useState(
    profile.vCard ? profile.vCard.middleName : ''
  );
  const [nickname, setNickname] = useState(
    profile.vCard ? profile.vCard.nickname : ''
  );
  const [url, setUrl] = useState(profile.vCard ? profile.vCard.url : '');
  const [birthday, setBirthday] = useState(
    profile.vCard ? profile.vCard.birthday : ''
  );
  const [organizationName, setOrganizationName] = useState(
    profile.vCard ? profile.vCard.organizationName : ''
  );
  const [organizationUnit, setOrganizationUnit] = useState(
    profile.vCard ? profile.vCard.organizationUnit : ''
  );
  const [title, setTitle] = useState(profile.vCard ? profile.vCard.title : '');
  const [role, setRole] = useState(profile.vCard ? profile.vCard.role : '');
  const [phoneNumber, setPhoneNumber] = useState(
    profile.vCard ? profile.vCard.phoneNumber : ''
  );
  const [street, setStreet] = useState(
    profile.vCard ? profile.vCard.street : ''
  );
  const [streetExtended, setStreetExtended] = useState(
    profile.vCard ? profile.vCard.streetExtended : ''
  );
  const [city, setCity] = useState(profile.vCard ? profile.vCard.city : '');
  const [state, setState] = useState(profile.vCard ? profile.vCard.state : '');
  const [zipCode, setZipCode] = useState(
    profile.vCard ? profile.vCard.zipCode : ''
  );
  const [country, setCountry] = useState(
    profile.vCard ? profile.vCard.country : ''
  );
  const [email, setEmail] = useState(profile.vCard ? profile.vCard.email : '');
  const [description, setDescription] = useState(
    profile.vCard ? profile.vCard.description : ''
  );
  const [photoType, setPhotoType] = useState(
    profile.vCard ? profile.vCard.photoType : ''
  );
  const [photo, setPhoto] = useState(profile.vCard ? profile.vCard.photo : '');

  const fileInput = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = {
      jid: state.profile.jid,
      fullName,
      firstName,
      lastName,
      middleName,
      nickname,
      url,
      birthday,
      organizationName,
      organizationUnit,
      title,
      role,
      phoneNumber,
      street,
      streetExtended,
      city,
      state,
      zipCode,
      country,
      email,
      description,
      photoType,
      photo,
    };
    setMyVCard(data);
  };

  const handleOnAvatarClick = (event: any) => {
    event.preventDefault();
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleOnAvatarChange = (event: any) => {
    if (event.target.files[0] && event.target.files[0].type.match(/image.*/)) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const result = reader.result.toString();
          setPhotoType(
            result
              ? result.substring(result.indexOf(':') + 1, result.indexOf(';'))
              : ''
          );
          setPhoto(
            result
              ? result.substring(result.indexOf(',') + 1, result.length)
              : ''
          );
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  React.useEffect(() => {
    if (profile && profile.vCard) {
      setFullName(profile.vCard.fullName);
      setFirstName(profile.vCard.firstName);
      setLastName(profile.vCard.lastName);
      setMiddleName(profile.vCard.middleName);
      setNickname(profile.vCard.nickname);
      setUrl(profile.vCard.url);
      setBirthday(profile.vCard.birthday);
      setOrganizationName(profile.vCard.organizationName);
      setOrganizationUnit(profile.vCard.organizationUnit);
      setTitle(profile.vCard.title);
      setRole(profile.vCard.role);
      setPhoneNumber(profile.vCard.phoneNumber);
      setStreet(profile.vCard.street);
      setStreetExtended(profile.vCard.streetExtended);
      setCity(profile.vCard.city);
      setState(profile.vCard.state);
      setZipCode(profile.vCard.zipCode);
      setCountry(profile.vCard.country);
      setEmail(profile.vCard.email);
      setDescription(profile.vCard.description);
      setPhotoType(profile.vCard.photoType);
      setPhoto(profile.vCard.photo);
    }
  }, [profile]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.avatarSection}>
          {photoType ? (
            <Avatar
              onClick={handleOnAvatarClick}
              className={classes.avatar}
              src={`data:${photoType};base64,${photo}`}
            />
          ) : (
            <Avatar onClick={handleOnAvatarClick} className={classes.avatar} />
          )}
          <Button onClick={handleOnAvatarClick}>Change</Button>
          <input
            ref={fileInput}
            type="file"
            name="pic"
            accept="image/*"
            className={classes.fileInput}
            onChange={handleOnAvatarChange}
          />
        </div>
        <div className={classes.userInfo}>
          <Typography variant="h5">{profile.username}</Typography>
          <Typography>{profile.group}</Typography>
          <Typography>{profile.jid}</Typography>
        </div>
      </div>
      {/* TODO: fix regex */}
      {profile.vCard ? (
        <Typography>Getting your details, please wait...</Typography>
      ) : (
        <ValidatorForm onSubmit={handleSubmit} className={classes.form}>
          <Tabs
            value={index}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event: any) => setIndex(event.target.value)}
          >
            <Tab label="User Info" />
            <Tab label="Contact Info" />
          </Tabs>
          {index === 0 && (
            <React.Fragment>
              <TextValidator
                name="fullName"
                onChange={(event: any) => setFullName(event.target.value)}
                label="Full Name"
                value={fullName}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="firstName"
                onChange={(event: any) => setFirstName(event.target.value)}
                label="First Name"
                value={firstName}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="lastName"
                onChange={(event: any) => setLastName(event.target.value)}
                label="Last Name"
                value={lastName}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="middleName"
                onChange={(event: any) => setMiddleName(event.target.value)}
                label="Middle Name"
                value={middleName}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="nickname"
                onChange={(event: any) => setNickname(event.target.value)}
                label="Nickname"
                value={nickname}
                variant="filled"
                validators={['matchRegexp:^[a-zA-Z0-9_\\.\\- ]*$']}
                errorMessages={['Please enter a valid nickname']}
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="description"
                onChange={(event: any) => setDescription(event.target.value)}
                label="Description"
                value={description}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="birthday"
                onChange={(event: any) => setBirthday(event.target.value)}
                label="Birthday"
                value={birthday}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
            </React.Fragment>
          )}
          {index === 1 && (
            <React.Fragment>
              <TextValidator
                name="organizationName"
                onChange={(event: any) =>
                  setOrganizationName(event.target.value)
                }
                label="Organization Name"
                value={organizationName}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="organizationUnit"
                onChange={(event: any) =>
                  setOrganizationUnit(event.target.value)
                }
                label="Organization Unit"
                value={organizationUnit}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="title"
                onChange={(event: any) => setTitle(event.target.value)}
                label="Title"
                value={title}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="role"
                onChange={(event: any) => setRole(event.target.value)}
                label="Role"
                value={role}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="email"
                onChange={(event: any) => setEmail(event.target.value)}
                label="Email"
                value={email}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="phoneNumber"
                onChange={(event: any) => setPhoneNumber(event.target.value)}
                label="Phone Number"
                value={phoneNumber}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="url"
                onChange={(event: any) => setUrl(event.target.value)}
                label="Url"
                value={url}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="street"
                onChange={(event: any) => setStreet(event.target.value)}
                label="Street"
                value={street}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="streetExtended"
                onChange={(event: any) => setStreetExtended(event.target.value)}
                label="Street Extended"
                value={streetExtended}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="city"
                onChange={(event: any) => setCity(event.target.value)}
                label="City"
                value={city}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="state"
                onChange={(event: any) => setState(event.target.value)}
                label="State"
                value={state}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="zipCode"
                onChange={(event: any) => setZipCode(event.target.value)}
                label="Zip Code"
                value={zipCode}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
              <TextValidator
                name="country"
                onChange={(event: any) => setCountry(event.target.value)}
                label="Country"
                value={country}
                variant="filled"
                FormHelperTextProps={{ className: classes.helperText }}
                className={classes.input}
              />
            </React.Fragment>
          )}
          <div className={classes.section}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </div>
        </ValidatorForm>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: any) => ({
  root: {
    padding: theme.spacing.unit * 4,
    overflowY: 'auto',
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    width: '128px',
    height: '128px',
    cursor: 'pointer',
  },
  userInfo: {
    marginLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 8,
  },
  section: {
    paddingBottom: theme.spacing.unit * 2,
  },
  name: {
    opacity: 0.4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
    '& > div': {
      paddingBottom: theme.spacing.unit * 2,
    },
  },
  tabs: {
    marginBottom: theme.spacing.unit,
  },
  fileInput: {
    display: 'none',
  },
  helperText: {},
  input: {},
}));

export default Account;
