import React from 'react';
import { connect } from 'react-redux'
import { FaUserCircle } from "react-icons/fa";
import { logoutUser }  from '../actions/userAuth'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onLogout = () => {
    this.props.dispatch(logoutUser())
  }

  render() {
    return (
      <div>
        <Navbar style={{backgroundColor: '#003a8c'}} light expand="md">
          <NavbarBrand  href="/" style={{color:"white"}}>SMS.</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/" style={{color:"white"}}>UserName</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav >
                    <FaUserCircle size="1.80em" color="#C9D4F8"/>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    Profile
                  </DropdownItem>
                  <DropdownItem>
                    History
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.onLogout}>
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default connect()(NavBar)