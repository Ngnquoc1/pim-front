import React from "react";
import Translate from "react-translate-component";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../Style/ErrorScreen.module.css";
import Image from "../Images/error.png";

function ErrorScreen() {
  return (
    <Container className={styles.errorContainer}>
      <Row className="align-items-center w-100">
        <Col md={6} className="text-center">
          <img src={Image} alt="error" className={styles.errorImage} />
        </Col>
        <Col md={6} className={styles.textContainer}>
          <div>
            <span>
              <Translate content="errorScreen.unexpected" />
            </span>
          </div>
          <span>
            <Translate content="errorScreen.please" />{" "}
          </span>
          <span className={styles.redText}>
            <Translate content="errorScreen.contact" />
          </span>
          <p />
          <div>
            <span>
              <Translate content="errorScreen.or" />{" "}
              <Link to="/">
                <Translate content="errorScreen.back" />
              </Link>
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorScreen;
