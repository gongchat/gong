import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import cyan from '@material-ui/core/colors/cyan';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import lime from '@material-ui/core/colors/lime';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import yellow from '@material-ui/core/colors/yellow';

export default class MaterialColorsUtil {
  public static colors = [
    { name: 'red', color: red },
    { name: 'pink', color: pink },
    { name: 'purple', color: purple },
    { name: 'deep purple', color: deepPurple },
    { name: 'indigo', color: indigo },
    { name: 'blue', color: blue },
    { name: 'light blue', color: lightBlue },
    { name: 'cyan', color: cyan },
    { name: 'teal', color: teal },
    { name: 'green', color: green },
    { name: 'light green', color: lightGreen },
    { name: 'lime', color: lime },
    { name: 'yellow', color: yellow },
    { name: 'amber', color: amber },
    { name: 'orange', color: orange },
    { name: 'deep orange', color: deepOrange },
    { name: 'brown', color: brown },
    { name: 'grey', color: grey },
    { name: 'blue grey', color: blueGrey },
  ];

  public static shades = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    'A100',
    'A200',
    'A400',
    'A700',
  ];
}
