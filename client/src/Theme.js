import { createMuiTheme } from "@material-ui/core/styles";

//Override base theme styles.
const Theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
});

//Build on top of theme styles.
const Styles = theme => ({
  modalPaper: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit,
  }
});

export {
  Theme,
  Styles
}
