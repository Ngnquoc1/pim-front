import React from "react";
import Translate from "react-translate-component";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../Style/Header.module.css";
import logo from "../Images/logo_elca.png";
import counterpart from "counterpart";
import en from "../lang/en";

counterpart.registerTranslations("en", en);

function Header() {
  return (
    <div className={styles.content}>
      <Container fluid>
        <Row>
          <Col xl={1} />
          <Col xl={1}>
            <img className={styles.logo} src={logo} alt="logo" />
          </Col>
          <Col xl={6}>
            <p className={styles.name}>
              <Translate content="header.name" />
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Header;
