import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import { useSearchCriteria, useProjectActions } from "../../store/useProjectStore";

function ProjectSearchBar() {
    const searchCriteria = useSearchCriteria();
    const { setSearchCriteria, resetSearchCriteria, fetchProjects } = useProjectActions();

    const [keyword, setKeyword] = useState(searchCriteria.keyword || "");
    const [statusFilter, setStatusFilter] = useState(searchCriteria.status || "ALL");

    useEffect(() => {
        setKeyword(searchCriteria.keyword || "");
        setStatusFilter(searchCriteria.status || "ALL");
      }, [searchCriteria.keyword, searchCriteria.status]);

      const handleSubmit = (e) => {
        e.preventDefault();
        const newCriteria = {
          keyword: keyword.trim(),
          status: statusFilter,
        };
        setSearchCriteria(newCriteria);
        fetchProjects(newCriteria).catch(() => {});
      };

    const handleReset = (e) => {
        e.preventDefault();
        setKeyword("");
        setStatusFilter("ALL");
        resetSearchCriteria();
        fetchProjects({ keyword: "", status: "ALL" }).catch(() => {});
    };

    return (
        <Form onSubmit={handleSubmit} className="project-search-bar mb-4">
            <Row className="align-items-center">
                <Col md={5} lg={4} sm={12} className="mb-2 mb-md-0">
                    <Form.Control
                        type="text"
                        placeholder={counterpart.translate("projectList.searchPlaceholder")}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="search-input"
                    />
                </Col>

                <Col md={3} lg={3} sm={12} className="mb-2 mb-md-0">
                    <Form.Control
                        as="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-select"
                    >
                        <option value="ALL">
                            {counterpart.translate("projectList.statusAll")}
                        </option>
                        <option value="NEW">
                            {counterpart.translate("projectList.statusNew")}
                        </option>
                        <option value="PLA">
                            {counterpart.translate("projectList.statusPla")}
                        </option>
                        <option value="INP">
                            {counterpart.translate("projectList.statusInp")}
                        </option>
                        <option value="FIN">
                            {counterpart.translate("projectList.statusFin")}
                        </option>
                    </Form.Control>
                </Col>

                <Col md={4} lg={5} sm={12} className="d-flex align-items-center">
                    <Button type="submit" variant="primary" className="search-btn mr-4">
                        <Translate content="projectList.searchButton" />
                    </Button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-link reset-search-link p-0 text-decoration-none"
                        style={{ color: "#2f85fa", cursor: "pointer", fontSize: "14px" }}
                    >
                        <Translate content="projectList.resetSearch" />
                    </button>
                </Col>
            </Row>
        </Form>
    );
}

export default ProjectSearchBar;