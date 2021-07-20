import { slide as Menu } from "react-burger-menu";
import React from "react";

class Burgermenu extends React.Component {
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
      <Menu>
        <a id='subscribe' className='menu-item' href='#'>
          Subscribe
        </a>
        <a id='select' className='menu-item' href='#'>
          Select
        </a>
        <a id='profile' className='menu-item' href='#'>
          Profile
        </a>
        <a id='more' className='menu-item' href='#'>
          More
        </a>
      </Menu>
    );
  }
}

export default Burgermenu;
