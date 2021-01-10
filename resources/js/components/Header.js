import React from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import * as actions from '../store/actions';

const Header = (props) => {
  const handleLogout = (e) => {
      e.preventDefault();
      props.dispatch(actions.authLogout());
    };
  return (
    <header className="d-flex align-items-center justify-content-between">
    <h1 className="logo my-0 font-weight-normal h4">
      <Link to="/">Blog App</Link>
    </h1>

    {props.isAuthenticated && (
      <div className="navigation d-flex justify-content-end">
        <Nav>
          <NavItem>
            <NavLink tag={Link} to="/archive">
              Blog Archive
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Account
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </div>
    )}
  </header>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(Header);
