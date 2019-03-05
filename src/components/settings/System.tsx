import * as React from 'react';

// redux & actions
import { connect } from 'react-redux';
import { setSettings } from 'src/actions/dispatcher';

// material ui
import { withStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// interface
import IStates from 'src/interfaces/IStates';
import BasePage from './BasePage';
import BaseSection from './BaseSection';

class System extends React.Component<any, any> {
  public state = {
    minimizeToTrayOnClose: this.props.settings.minimizeToTrayOnClose,
  };

  public render() {
    const { minimizeToTrayOnClose } = this.state;

    return (
      <BasePage title="System">
        <BaseSection title="On Close">
          <FormControlLabel
            control={
              <Switch
                name="minimizeToTrayOnClose"
                checked={minimizeToTrayOnClose}
                onChange={this.handleOnChange}
              />
            }
            label="Minimize to tray"
          />
        </BaseSection>
      </BasePage>
    );
  }

  private handleOnChange = (event: any, value: any) => {
    const name = event.target.name;
    this.setState({ [event.target.name]: value });
    this.props.setSettings({
      minimizeToTrayOnClose:
        name === 'minimizeToTrayOnClose'
          ? value
          : this.state.minimizeToTrayOnClose,
    });
  };
}

const mapStateToProps = (states: IStates) => ({
  settings: states.gong.settings,
});

const mapDispatchToProps = {
  setSettings,
};

const styles: any = (theme: any) => ({
  root: {},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(System));
