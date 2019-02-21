import * as React from 'react';
import { Route } from 'react-router';
import { HashRouter } from 'react-router-dom';

// redux & actions
import { connect } from 'react-redux';

// material ui
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

// libs
import * as WebFont from 'webfontloader';

// interfaces
import IStates from 'src/interfaces/IStates';

// components
import Loading from './Loading';
import Login from './Login';
import Main from './Main';
import SnackbarNotifications from './SnackbarNotifications';

class Router extends React.Component<any, any> {
  public componentWillReceiveProps(nextProps: any) {
    if (nextProps.theme) {
      this.loadFont(nextProps.theme.typography.fontFamily);
    }
  }

  public render() {
    const { theme } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarNotifications />
        <HashRouter>
          <div style={{ height: '100%' }}>
            <Route path="/" exact={true} component={Loading} />
            <Route path="/login" component={Login} />
            <Route path="/main" component={Main} />
          </div>
        </HashRouter>
      </MuiThemeProvider>
    );
  }

  private loadFont(fontFamily: string) {
    const font: string = fontFamily.split(',')[0].replace(/"/g, '');
    WebFont.load({
      google: {
        families: [`${font}:400,700`, 'sans-serif'],
      },
    });
  }
}

const mapStateToProps = (states: IStates) => {
  return {
    theme: states.gong.theme,
  };
};

export default connect(
  mapStateToProps,
  null
)(Router);
