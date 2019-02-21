import * as React from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

// redux & actions
import { connect } from 'react-redux';
import { setMyVCard } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import IStates from 'src/interfaces/IStates';

class Account extends React.Component<any, any> {
  public state = {
    index: 0,
    fullName: this.props.profile.vCard ? this.props.profile.vCard.fullName : '',
    firstName: this.props.profile.vCard
      ? this.props.profile.vCard.firstName
      : '',
    lastName: this.props.profile.vCard ? this.props.profile.vCard.lastName : '',
    middleName: this.props.profile.vCard
      ? this.props.profile.vCard.middleName
      : '',
    nickname: this.props.profile.vCard ? this.props.profile.vCard.nickname : '',
    url: this.props.profile.vCard ? this.props.profile.vCard.url : '',
    birthday: this.props.profile.vCard ? this.props.profile.vCard.birthday : '',
    organizationName: this.props.profile.vCard
      ? this.props.profile.vCard.organizationName
      : '',
    organizationUnit: this.props.profile.vCard
      ? this.props.profile.vCard.organizationUnit
      : '',
    title: this.props.profile.vCard ? this.props.profile.vCard.title : '',
    role: this.props.profile.vCard ? this.props.profile.vCard.role : '',
    phoneNumber: this.props.profile.vCard
      ? this.props.profile.vCard.phoneNumber
      : '',
    street: this.props.profile.vCard ? this.props.profile.vCard.street : '',
    streetExtended: this.props.profile.vCard
      ? this.props.profile.vCard.streetExtended
      : '',
    city: this.props.profile.vCard ? this.props.profile.vCard.city : '',
    state: this.props.profile.vCard ? this.props.profile.vCard.state : '',
    zipCode: this.props.profile.vCard ? this.props.profile.vCard.zipCode : '',
    country: this.props.profile.vCard ? this.props.profile.vCard.country : '',
    email: this.props.profile.vCard ? this.props.profile.vCard.email : '',
    description: this.props.profile.vCard
      ? this.props.profile.vCard.description
      : '',
    photoType: this.props.profile.vCard
      ? this.props.profile.vCard.photoType
      : '',
    photo: this.props.profile.vCard ? this.props.profile.vCard.photo : '',
  };

  private fileInput: React.RefObject<HTMLInputElement>;

  public constructor(props) {
    super(props);

    this.fileInput = React.createRef<HTMLInputElement>();
  }

  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.profile && nextProps.profile.vCard) {
      this.setState({
        fullName: nextProps.profile.vCard.fullName,
        firstName: nextProps.profile.vCard.firstName,
        lastName: nextProps.profile.vCard.lastName,
        middleName: nextProps.profile.vCard.middleName,
        nickname: nextProps.profile.vCard.nickname,
        url: nextProps.profile.vCard.url,
        birthday: nextProps.profile.vCard.birthday,
        organizationName: nextProps.profile.vCard.organizationName,
        organizationUnit: nextProps.profile.vCard.organizationUnit,
        title: nextProps.profile.vCard.title,
        role: nextProps.profile.vCard.role,
        phoneNumber: nextProps.profile.vCard.phoneNumber,
        street: nextProps.profile.vCard.street,
        streetExtended: nextProps.profile.vCard.streetExtended,
        city: nextProps.profile.vCard.city,
        state: nextProps.profile.vCard.state,
        zipCode: nextProps.profile.vCard.zipCode,
        country: nextProps.profile.vCard.country,
        email: nextProps.profile.vCard.email,
        description: nextProps.profile.vCard.description,
        photoType: nextProps.profile.vCard.photoType,
        photo: nextProps.profile.vCard.photo,
      });
    }
  }

  public render() {
    const { classes, profile } = this.props;
    const {
      index,
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
    } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.avatarSection}>
            {photoType ? (
              <Avatar
                onClick={this.handleOnAvatarClick}
                className={classes.avatar}
                src={`data:${photoType};base64,${photo}`}
              />
            ) : (
              <Avatar
                onClick={this.handleOnAvatarClick}
                className={classes.avatar}
              />
            )}
            <Button onClick={this.handleOnAvatarClick}>Change Avatar</Button>
            <input
              ref={this.fileInput}
              type="file"
              name="pic"
              accept="image/*"
              className={classes.fileInput}
              onChange={this.handleOnAvatarChange}
            />
          </div>
          <div className={classes.userInfo}>
            <Typography variant="h5">{profile.username}</Typography>
            <Typography>{profile.group}</Typography>
            <Typography>{profile.jid}</Typography>
          </div>
        </div>
        {/* TODO: fix regex */}
        {this.props.vCard ? (
          <Typography>Getting your details, please wait...</Typography>
        ) : (
          <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
            <Tabs
              value={index}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleOnTabChange}
            >
              <Tab label="User Info" />
              <Tab label="Contact Info" />
            </Tabs>
            {index === 0 && (
              <React.Fragment>
                <TextValidator
                  name="fullName"
                  onChange={this.handleOnChange}
                  label="Full Name"
                  value={fullName}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="firstName"
                  onChange={this.handleOnChange}
                  label="First Name"
                  value={firstName}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="lastName"
                  onChange={this.handleOnChange}
                  label="Last Name"
                  value={lastName}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="middleName"
                  onChange={this.handleOnChange}
                  label="Middle Name"
                  value={middleName}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="nickname"
                  onChange={this.handleOnChange}
                  label="Nickname"
                  value={nickname}
                  variant="filled"
                  validators={['matchRegexp:^[a-zA-Z0-9_.- ]*$']}
                  errorMessages={['Please enter a valid nickname']}
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="description"
                  onChange={this.handleOnChange}
                  label="Description"
                  value={description}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="birthday"
                  onChange={this.handleOnChange}
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
                  onChange={this.handleOnChange}
                  label="Organization Name"
                  value={organizationName}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="organizationUnit"
                  onChange={this.handleOnChange}
                  label="Organization Unit"
                  value={organizationUnit}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="title"
                  onChange={this.handleOnChange}
                  label="Title"
                  value={title}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="role"
                  onChange={this.handleOnChange}
                  label="Role"
                  value={role}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="email"
                  onChange={this.handleOnChange}
                  label="Email"
                  value={email}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="phoneNumber"
                  onChange={this.handleOnChange}
                  label="Phone Number"
                  value={phoneNumber}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="url"
                  onChange={this.handleOnChange}
                  label="Url"
                  value={url}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="street"
                  onChange={this.handleOnChange}
                  label="Street"
                  value={street}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="streetExtended"
                  onChange={this.handleOnChange}
                  label="Street Extended"
                  value={streetExtended}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="city"
                  onChange={this.handleOnChange}
                  label="City"
                  value={city}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="state"
                  onChange={this.handleOnChange}
                  label="State"
                  value={state}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="zipCode"
                  onChange={this.handleOnChange}
                  label="Zip Code"
                  value={zipCode}
                  variant="filled"
                  FormHelperTextProps={{ className: classes.helperText }}
                  className={classes.input}
                />
                <TextValidator
                  name="country"
                  onChange={this.handleOnChange}
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
  }

  private handleOnChange = (event: any) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  private handleOnTabChange = (event: any, value: number) => {
    this.setState({ index: value });
  };

  private handleSubmit = (event: any) => {
    event.preventDefault();
    const data = {
      jid: this.props.profile.jid,
      fullName: this.state.fullName,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      middleName: this.state.middleName,
      nickname: this.state.nickname,
      url: this.state.url,
      birthday: this.state.birthday,
      organizationName: this.state.organizationName,
      organizationUnit: this.state.organizationUnit,
      title: this.state.title,
      role: this.state.role,
      phoneNumber: this.state.phoneNumber,
      street: this.state.street,
      streetExtended: this.state.streetExtended,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode,
      country: this.state.country,
      email: this.state.email,
      description: this.state.description,
      photoType: this.state.photoType,
      photo: this.state.photo,
    };
    this.props.setMyVCard(data);
  };

  private handleOnAvatarClick = (event: any) => {
    event.preventDefault();
    if (this.fileInput.current) {
      this.fileInput.current.click();
    }
  };

  private handleOnAvatarChange = (event: any) => {
    if (event.target.files[0] && event.target.files[0].type.match(/image.*/)) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const result = reader.result.toString();
          this.setState({
            photoType: result
              ? result.substring(result.indexOf(':') + 1, result.indexOf(';'))
              : '',
            photo: result
              ? result.substring(result.indexOf(',') + 1, result.length)
              : '',
          });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
}

const mapStateToProps = (states: IStates) => ({
  profile: states.gong.profile,
});

const mapDispatchToProps = {
  setMyVCard,
};

const styles: any = (theme: any) => ({
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Account));
