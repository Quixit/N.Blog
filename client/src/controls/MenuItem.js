import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Styles} from '../theme';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PagesIcon from '@material-ui/icons/Pages';
import SubIcon from '@material-ui/icons/SubdirectoryArrowRight';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

import { withStyles } from '@material-ui/core/styles';

class MenuItem extends Component {
  render() {
    const { item, onClick, isChild} = this.props;

    return (
      <List>
        <ListItem button onClick={() => onClick(item)}>
          <ListItemIcon>
            {isChild ? <SubIcon /> : <PagesIcon />}
          </ListItemIcon>
          <ListItemText primary={item.page.title} />
          {item.children.length > 0 ? (item.expanded ? <ExpandLess /> : <ExpandMore />) : null}
        </ListItem>
        <Collapse in={item.expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((child, index) => (
             <MenuItem item={child} onClick={onClick} isChild={true} key={child.page.slug} />
          ))}
         </List>
       </Collapse>
     </List>
    );
  }
}

MenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isChild: PropTypes.bool
};

export default withStyles(Styles)(MenuItem);
