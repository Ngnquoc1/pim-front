import React from "react";
import Translate from "react-translate-component";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Style/ErrorScreen.css";
import Image from "../Images/error.png";

function ErrorScreen() {
  return (
    <Container>
      <Row>
        <Col>
          <img src={Image} alt="error" className="error" />
        </Col>
        <Col className="text-container">
          <div>
            <span>
              <Translate content="errorScreen.unexpected" />
            </span>
          </div>
          <span>
            <Translate content="errorScreen.please" />{" "}
          </span>
          <span className="red-text">
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
