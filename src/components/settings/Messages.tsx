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

class Messages extends React.Component<any, any> {
  public state = {
    renderVideos: this.props.settings.renderVideos,
    renderGetYarn: this.props.settings.renderGetYarn,
    renderImages: this.props.settings.renderImages,
  };

  public render() {
    const { renderVideos, renderGetYarn, renderImages } = this.state;

    return (
      <BasePage title="Messages">
        <BaseSection title="Display">
          <FormControlLabel
            control={
              <Switch
                name="renderVideos"
                checked={renderVideos}
                onChange={this.handleOnChange}
              />
            }
            label="Show videos"
          />
          <FormControlLabel
            control={
              <Switch
                name="renderGetYarn"
                checked={renderGetYarn}
                onChange={this.handleOnChange}
              />
            }
            label="Show GetYarn"
          />
          <FormControlLabel
            control={
              <Switch
                name="renderImages"
                checked={renderImages}
                onChange={this.handleOnChange}
              />
            }
            label="Show images"
          />
        </BaseSection>
      </BasePage>
    );
  }

  private handleOnChange = (event: any, value: any) => {
    const name = event.target.name;
    this.setState({ [name]: value });
    this.props.setSettings({ [name]: value });
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
)(withStyles(styles)(Messages));
