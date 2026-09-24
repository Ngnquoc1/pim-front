import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Translate from "react-translate-component";
import ProjectSearchBar from "../../Components/Project/ProjectSearchBar";
import ProjectList from "../../Components/Project/ProjectList";
import { useProjectStore, useProjectActions } from "../../store/useProjectStore";
import styles from "../Style/SearchPage.module.css";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchProjects, setSearchCriteria } = useProjectActions();

  useEffect(() => {
    const hasParamsOnUrl = Array.from(searchParams.keys()).length > 0;

    if (hasParamsOnUrl) {
      const keyword = searchParams.get("keyword") || "";
      const status = searchParams.get("status") || "ALL";
      const groupLeaderVisa = searchParams.get("groupLeaderVisa") || "";
      const memberVisasStr = searchParams.get("memberVisas") || "";
      const memberVisas = memberVisasStr ? memberVisasStr.split(",") : [];
      const startDateFrom = searchParams.get("startDateFrom") || "";
      const startDateTo = searchParams.get("startDateTo") || "";
      const endDateFrom = searchParams.get("endDateFrom") || "";
      const endDateTo = searchParams.get("endDateTo") || "";
      const page = Number(searchParams.get("page")) || 0;

      const criteriaFromUrl = {
        keyword,
        status,
        groupLeaderVisa,
        memberVisas,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
      };

      setSearchCriteria(criteriaFromUrl);

      fetchProjects({
        page,
        searchCriteria: criteriaFromUrl,
      }).catch(() => {});
    } else {
      // Khi URL không có tham số (/projects hoặc /), kiểm tra xem Store có tiêu chí đã lưu không:
      const state = useProjectStore.getState();
      const currentCriteria = state.searchCriteria;
      const hasStoredCriteria = Boolean(
        currentCriteria.keyword ||
        (currentCriteria.status && currentCriteria.status !== "ALL") ||
        currentCriteria.groupLeaderVisa ||
        (currentCriteria.memberVisas && currentCriteria.memberVisas.length > 0) ||
        currentCriteria.startDateFrom ||
        currentCriteria.startDateTo ||
        currentCriteria.endDateFrom ||
        currentCriteria.endDateTo
      );

      if (hasStoredCriteria) {
        const paramsForUrl = {};
        if (currentCriteria.keyword) paramsForUrl.keyword = currentCriteria.keyword;
        if (currentCriteria.status && currentCriteria.status !== "ALL") paramsForUrl.status = currentCriteria.status;
        if (currentCriteria.groupLeaderVisa) paramsForUrl.groupLeaderVisa = currentCriteria.groupLeaderVisa;
        if (currentCriteria.memberVisas && currentCriteria.memberVisas.length > 0) {
          paramsForUrl.memberVisas = currentCriteria.memberVisas.join(",");
        }
        if (currentCriteria.startDateFrom) paramsForUrl.startDateFrom = currentCriteria.startDateFrom;
        if (currentCriteria.startDateTo) paramsForUrl.startDateTo = currentCriteria.startDateTo;
        if (currentCriteria.endDateFrom) paramsForUrl.endDateFrom = currentCriteria.endDateFrom;
        if (currentCriteria.endDateTo) paramsForUrl.endDateTo = currentCriteria.endDateTo;
        if (state.pagination && state.pagination.pageNumber) paramsForUrl.page = state.pagination.pageNumber;

        setSearchParams(paramsForUrl, { replace: true });
      } else {
        fetchProjects().catch(() => {});
      }
    }
  }, [searchParams, setSearchParams, fetchProjects, setSearchCriteria]);

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
