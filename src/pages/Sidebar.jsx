import React from "react";
import Translate from "react-translate-component";
import { Row, Col, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";
import { ROUTES } from "../constants/routes";

function Sidebar() {
  const location = useLocation();
  const { pathname } = location;

  // Active state for Project List (root "/" or "/projects")
  const isProjectListActive = pathname === ROUTES.HOME || pathname === ROUTES.PROJECTS;

  // Active state for sub-items under "New"
  const isProjectActive =
    pathname === ROUTES.CREATE_PROJECT ||
    pathname === ROUTES.PROJECTS_NEW ||
    pathname.startsWith("/projects/edit");

  const isCustomerActive = pathname === ROUTES.CUSTOMER;
  const isSupplierActive = pathname === ROUTES.SUPPLIER;

  // "New" main section header is active when any of its child items are active
  const isNewActive = isProjectActive || isCustomerActive || isSupplierActive;

  return (
    <Navbar collapseOnSelect expand="lg" className={styles.navbarCustom}>
      <Navbar.Brand />
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className={styles.navigation}>
          <Row className="w-100 m-0">
            <Col xl={12} className="p-0">
              {/* Main item: Project List */}
              <Nav.Link as={Link} to={ROUTES.HOME} className={styles.navLinkItem}>
                <p
                  className={`${styles.textSemiBold} ${styles.firstElement} ${
                    isProjectListActive ? styles.activeMainItem : styles.inactiveMainItem
                  }`}
                >
                  <Translate content="navigation.title" />
                </p>
              </Nav.Link>

              {/* Main group header: New */}
              <div className={`${styles.navGroupHeaderWrapper} ${styles.navLinkItem}`}>
                <p
                  className={`${styles.textSemiBold} ${styles.groupTitle} ${
                    isNewActive ? styles.activeMainItem : styles.inactiveMainItem
                  }`}
                >
                  <Translate content="navigation.new" />
                </p>
              </div>

              {/* Sub-item: Project */}
              <Nav.Link
                as={Link}
                to={ROUTES.CREATE_PROJECT}
                className={`${styles.subItem} ${
                  isProjectActive ? styles.subItemActive : styles.subItemInactive
                }`}
              >
                <Translate content="navigation.project" />
              </Nav.Link>

              {/* Sub-item: Customer */}
              <Nav.Link
                as={Link}
                to={ROUTES.CUSTOMER}
                className={`${styles.subItem} ${
                  isCustomerActive ? styles.subItemActive : styles.subItemInactive
                }`}
              >
                <Translate content="navigation.customer" />
              </Nav.Link>

              {/* Sub-item: Supplier */}
              <Nav.Link
                as={Link}
                to={ROUTES.SUPPLIER}
                className={`${styles.subItem} ${
                  isSupplierActive ? styles.subItemActive : styles.subItemInactive
                }`}
              >
                <Translate content="navigation.supplier" />
              </Nav.Link>
            </Col>
          </Row>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Sidebar;

