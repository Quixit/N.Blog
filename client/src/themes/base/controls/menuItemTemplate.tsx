import React, { Component } from 'react';

import { List, ListItem, ListItemText, ListItemIcon, Collapse } from "@mui/material";
import { Pages, SubdirectoryArrowRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import { MenuItemProps } from '../../interfaces/props';

class MenuItemTemplate extends Component<MenuItemProps> {
  render() {
    const { item, onClick, isChild, menuItems} = this.props;

    return (
      <List>
        <ListItem button onClick={() => onClick(item)}>
          <ListItemIcon>
            {isChild ? <SubdirectoryArrowRight /> : <Pages />}
          </ListItemIcon>
          <ListItemText primary={item.page.title} />
          {item.children.length > 0 ? (item.expanded ? <ExpandLess /> : <ExpandMore />) : null}
        </ListItem>
        <Collapse in={item.expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          { menuItems }
         </List>
       </Collapse>
     </List>
    );
  }
}

export default MenuItemTemplate;
