import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Translate from "react-translate-component";
import ProjectSearchBar from "../../Components/Project/ProjectSearchBar";
import ProjectList from "../../Components/Project/ProjectList";
import { useProjectActions } from "../../store/useProjectStore";

function SearchPage() {
  const { fetchProjects } = useProjectActions();

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  return (
    <Container fluid className="search-page-container py-3">
      <Row>
        <Col>
          <h3 className="mb-4 pb-2 border-bottom">
            <Translate content="projectList.title" />
          </h3>
          
          <ProjectSearchBar />

          <ProjectList />
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;
