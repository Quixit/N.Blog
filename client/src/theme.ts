import { createMuiTheme, createStyles } from "@material-ui/core/styles";
import { Theme } from '@material-ui/core/styles/createMuiTheme';

//Override base theme styles.
const theme = createMuiTheme({
});

//Build on top of theme styles.
const styles = (theme:Theme) => createStyles({
  modalPaper: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  button: {
    margin: theme.spacing(1)
  },
  baseline: {
    padding: theme.spacing(1)
  },
  tableContainer: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  }
});

export {
  theme,
  styles
}
