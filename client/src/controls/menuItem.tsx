import React, { Component } from 'react';
import { MenuItemTemplate, styles } from '../theme';

import { withStyles } from '@material-ui/core/styles';
import { PageItem } from '../../../shared';

interface Props {
  item: PageItem;
  onClick:  (page: PageItem) => void;
  isChild?: boolean;
}

class MenuItem extends Component<Props> {
  render() {
    const {item, onClick } = this.props;

    return (
        <MenuItemTemplate
          menuItems={
            item.children.map((child) => (
               <MenuItem item={child} onClick={onClick} isChild={true} key={child.page.slug} />
            ))
          }
          {...this.props}
        />
    );
  }
}

export default withStyles(styles)(MenuItem);
