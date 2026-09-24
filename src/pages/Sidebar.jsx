import React from "react";
import Translate from "react-translate-component";
import { Row, Col, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { ROUTES } from "../constants/routes";

function Sidebar() {
  return (
    <Navbar collapseOnSelect expand="lg" className={styles.navbarCustom}>
      <Navbar.Brand />
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className={styles.navigation}>
          <Row>
            <Col xl={12}>
              <Nav.Link as={Link} to={ROUTES.HOME}>
                <p className={`${styles.textSemiBold} ${styles.firstElement}`}>
                  <Translate content="navigation.title" />
                </p>
              </Nav.Link>
              <Nav.Link as="div" style={{ cursor: "default" }}>
                <p className={styles.textSemiBold}>
                  <Translate content="navigation.new" />
                </p>
              </Nav.Link>
              <Nav.Link as={Link} to={ROUTES.CREATE_PROJECT}>
                <Translate content="navigation.project" />
              </Nav.Link>
              <Nav.Link as={Link} to={ROUTES.CUSTOMER}>
                <Translate content="navigation.customer" />
              </Nav.Link>
              <Nav.Link as={Link} to={ROUTES.SUPPLIER}>
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
