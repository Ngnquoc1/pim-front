import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import { useSearchParams } from "react-router-dom";
import ProjectAdvancedFilter from "./ProjectAdvancedFilter";
import FilterIcon from "../Common/FilterIcon";
import {
    useSearchCriteria,
    useProjectActions,
    useLocale,
    useIsAdvancedFilterOpen,
} from "../../store/useProjectStore";
import styles from "./ProjectSearchBar.module.css";

const parseMemberVisas = (visaValue) => {
    if (!visaValue) return [];
    if (visaValue instanceof Set) return Array.from(visaValue);
    if (Array.isArray(visaValue)) return Array.from(new Set(visaValue));
    if (typeof visaValue === "string") {
        return Array.from(new Set(visaValue.split(",").map((v) => v.trim()).filter(Boolean)));
    }
    return [];
};

function ProjectSearchBar() {
    useLocale(); // Trigger re-render when language changes
    const searchCriteria = useSearchCriteria();
    const isAdvancedOpen = useIsAdvancedFilterOpen();
    const {
        setSearchCriteria,
        resetSearchCriteria,
        setIsAdvancedFilterOpen,
        fetchProjects,
    } = useProjectActions();

    const [keyword, setKeyword] = useState(searchCriteria.keyword || "");
    const [statusFilter, setStatusFilter] = useState(searchCriteria.status || "ALL");

    const [advancedValues, setAdvancedValues] = useState({
        groupLeaderVisa: searchCriteria.groupLeaderVisa || "",
        memberVisas: parseMemberVisas(searchCriteria.memberVisas !== undefined ? searchCriteria.memberVisas : searchCriteria.memberVisa),
        startDateFrom: searchCriteria.startDateFrom || "",
        startDateTo: searchCriteria.startDateTo || "",
        endDateFrom: searchCriteria.endDateFrom || "",
        endDateTo: searchCriteria.endDateTo || "",
    });

    const [, setSearchParams] = useSearchParams();

    const [dateError, setDateError] = useState("");

    // Synchronize local state when store searchCriteria changes
    useEffect(() => {
        setKeyword(searchCriteria.keyword || "");
        setStatusFilter(searchCriteria.status || "ALL");
        setAdvancedValues({
            groupLeaderVisa: searchCriteria.groupLeaderVisa || "",
            memberVisas: parseMemberVisas(searchCriteria.memberVisas !== undefined ? searchCriteria.memberVisas : searchCriteria.memberVisa),
            startDateFrom: searchCriteria.startDateFrom || "",
            startDateTo: searchCriteria.startDateTo || "",
            endDateFrom: searchCriteria.endDateFrom || "",
            endDateTo: searchCriteria.endDateTo || "",
        });
    }, [searchCriteria]);

    const handleAdvancedChange = (field, value) => {
        setAdvancedValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const {
            groupLeaderVisa,
            memberVisas,
            startDateFrom,
            startDateTo,
            endDateFrom,
            endDateTo,
        } = advancedValues;

        // Client-side date range validation
        if (startDateFrom && startDateTo && startDateFrom > startDateTo) {
            setDateError(counterpart.translate("projectList.invalidStartDateRange"));
            return;
        }
        if (endDateFrom && endDateTo && endDateFrom > endDateTo) {
            setDateError(counterpart.translate("projectList.invalidEndDateRange"));
            return;
        }
        setDateError("");

        const paramsForUrl = {};

        if (keyword.trim()) paramsForUrl.keyword = keyword.trim();
        if (statusFilter !== 'ALL') paramsForUrl.status = statusFilter;
        if (groupLeaderVisa.trim()) {
            paramsForUrl.groupLeaderVisa = groupLeaderVisa.trim();
        }
        if (advancedValues.memberVisas.length > 0) {
            paramsForUrl.memberVisas = memberVisas.join(",");
        }
        if (startDateFrom) paramsForUrl.startDateFrom = startDateFrom;
        if (startDateTo) paramsForUrl.startDateTo = startDateTo;
        if (endDateFrom) paramsForUrl.endDateFrom = endDateFrom;
        if (endDateTo) paramsForUrl.endDateTo = endDateTo;
        paramsForUrl.page = 0;

        setSearchParams(paramsForUrl);

        const newCriteria = {
            keyword: keyword.trim(),
            status: statusFilter,
            groupLeaderVisa: (groupLeaderVisa || "").trim(),
            memberVisas: Array.from(new Set(memberVisas || [])),
            startDateFrom: startDateFrom || "",
            startDateTo: startDateTo || "",
            endDateFrom: endDateFrom || "",
            endDateTo: endDateTo || "",
        };

        setSearchCriteria(newCriteria);
        fetchProjects({ page: 0, searchCriteria: newCriteria }).catch(() => { });
    };

    const handleReset = (e) => {
        e.preventDefault();
        setKeyword("");
        setStatusFilter("ALL");
        setAdvancedValues({
            groupLeaderVisa: "",
            memberVisas: [],
            startDateFrom: "",
            startDateTo: "",
            endDateFrom: "",
            endDateTo: "",
        });
        setDateError("");

        const emptyCriteria = {
            keyword: "",
            status: "ALL",
            groupLeaderVisa: "",
            memberVisas: [],
            startDateFrom: "",
            startDateTo: "",
            endDateFrom: "",
            endDateTo: "",
        };

        setSearchParams({});
        resetSearchCriteria();
        fetchProjects({ page: 0, searchCriteria: emptyCriteria }).catch(() => { });
    };

    const handleToggleAdvanced = () => {
        setIsAdvancedFilterOpen(!isAdvancedOpen);
    };

    return (
        <Form onSubmit={handleSubmit} className={styles.searchBarContainer}>
            {/* Primary Search Bar Row */}
            <Row className="align-items-center">
                <Col xl={4} lg={3} md={6} sm={12} className="mb-2 mb-lg-0">
                    <Form.Control
                        type="text"
                        placeholder={counterpart.translate("projectList.searchPlaceholder")}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className={styles.searchInput}
                    />
                </Col>

                <Col xl={3} lg={3} md={6} sm={12} className="mb-2 mb-lg-0">
                    <Form.Control
                        as="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.statusSelect}
                    >
                        <option value="ALL">{counterpart.translate("projectList.statusAll")}</option>
                        <option value="NEW">{counterpart.translate("projectList.statusNew")}</option>
                        <option value="PLA">{counterpart.translate("projectList.statusPla")}</option>
                        <option value="INP">{counterpart.translate("projectList.statusInp")}</option>
                        <option value="FIN">{counterpart.translate("projectList.statusFin")}</option>
                    </Form.Control>
                </Col>

                <Col xl={5} lg={6} md={12} sm={12} className="d-flex align-items-center flex-wrap mt-2 mt-lg-0">
                    <button
                        type="submit"
                        className="btn btn-pim-primary mr-3 mb-1 mb-sm-0"
                    >
                        <Translate content="projectList.searchButton" />
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-pim-link mr-3 mb-1 mb-sm-0"
                    >
                        <Translate content="projectList.resetSearch" />
                    </button>
                    <button
                        type="button"
                        onClick={handleToggleAdvanced}
                        className={`btn btn-pim-icon ${isAdvancedOpen ? "active" : ""} mb-1 mb-sm-0`}
                        title={
                            isAdvancedOpen
                                ? counterpart.translate("projectList.hideAdvancedFilter")
                                : counterpart.translate("projectList.advancedFilter")
                        }
                        aria-label={
                            isAdvancedOpen
                                ? counterpart.translate("projectList.hideAdvancedFilter")
                                : counterpart.translate("projectList.advancedFilter")
                        }
                    >
                        <FilterIcon size={16} filled={isAdvancedOpen} />
                        {Boolean(
                            advancedValues.groupLeaderVisa ||
                            (advancedValues.memberVisas && advancedValues.memberVisas.length > 0) ||
                            advancedValues.startDateFrom ||
                            advancedValues.startDateTo ||
                            advancedValues.endDateFrom ||
                            advancedValues.endDateTo
                        ) && !isAdvancedOpen && (
                                <span className="btn-pim-icon-badge" />
                            )}
                    </button>
                </Col>
            </Row>

            {/* Collapsible Advanced Filter Panel */}
            <ProjectAdvancedFilter
                isOpen={isAdvancedOpen}
                values={advancedValues}
                onChange={handleAdvancedChange}
                dateError={dateError}
            />
        </Form>
    );
}

export default ProjectSearchBar;