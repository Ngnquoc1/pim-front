import React from "react";
import Translate from "react-translate-component";
import { Row, Col, Nav, Navbar } from "react-bootstrap";
import styles from "../Style/Navigation.module.css";
import counterpart from "counterpart";
import en from "../lang/en";
import { Link } from "react-router-dom";

counterpart.registerTranslations("en", en);

function Sidebar() {
  return (
    <Navbar collapseOnSelect expand="lg" className={styles.navbarCustom}>
      <Navbar.Brand />
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className={styles.navigation}>
          <Row>
            <Col xl={12}>
              <Nav.Link as={Link} to="/">
                <p className={`${styles.textSemiBold} ${styles.firstElement}`}>
                  <Translate content="navigation.title" />
                </p>
              </Nav.Link>
              <Nav.Link>
                <p className={styles.textSemiBold}>
                  <Translate content="navigation.new" />
                </p>
              </Nav.Link>
              <Nav.Link as={Link} to="/create-project">
                <Translate content="navigation.project" />
              </Nav.Link>
              <Nav.Link as={Link} to="/customer">
                <Translate content="navigation.customer" />
              </Nav.Link>
              <Nav.Link as={Link} to="/supplier">
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
