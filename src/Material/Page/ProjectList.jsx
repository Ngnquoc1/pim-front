import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Translate from "react-translate-component";

function ProjectList() {
  return (
    <Container fluid className="project-list-container">
      <Row>
        <Col>
          <h3>
            <Translate content="navigation.title" />
          </h3>
          
        </Col>
      </Row>
    </Container>
  );
}

export default ProjectList;
