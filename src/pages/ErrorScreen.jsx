import React from "react";
import Translate from "react-translate-component";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./ErrorScreen.module.css";
import Image from "../assets/images/error.png";
import { ROUTES } from "../constants/routes";

function ErrorScreen() {
  return (
    <Container className={styles.errorContainer}>
      <Row>
        <Col className="d-flex justify-content-center">
          <img src={Image} alt="error" className={styles.errorImage} />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center text-center">
          <p className={styles.errorText}>
            <Translate content="errorScreen.unexpected" />
            <br />
            <Translate content="errorScreen.please" />{" "}
            <a
              href="#contact"
              className={styles.contactLink}
              onClick={(e) => e.preventDefault()}
            >
              <Translate content="errorScreen.contact" />
            </a>{" "}
            <Translate content="errorScreen.or" />{" "}
            <Link to={ROUTES.HOME} className={styles.backLink}>
              <Translate content="errorScreen.back" />
            </Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorScreen;
