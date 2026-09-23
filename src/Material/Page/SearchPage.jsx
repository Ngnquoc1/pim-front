import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Translate from "react-translate-component";
import ProjectSearchBar from "../../Components/Project/ProjectSearchBar";
import ProjectList from "../../Components/Project/ProjectList";
import { useProjectActions } from "../../store/useProjectStore";
import styles from "../Style/SearchPage.module.css";

function SearchPage() {
  const { fetchProjects } = useProjectActions();

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  return (
    <Container fluid className={styles.searchPageContainer}>
      <Row>
        <Col>
          <h2 className={styles.pageTitle}>
            <Translate content="projectList.title" />
          </h2>
          <hr className={styles.pageDivider} />
          
          <ProjectSearchBar />

          <ProjectList />
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;
