import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, Form } from "react-bootstrap";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import groupService from "../../services/groupService";
import MemberAutocomplete from "./MemberAutocomplete";
import styles from "./ProjectAdvancedFilter.module.css";

function ProjectAdvancedFilter({
    isOpen,
    values,
    onChange,
    dateError,
}) {
    const [groups, setGroups] = useState([]);

    // Load groups for Project Leader dropdown
    useEffect(() => {
        let isMounted = true;
        groupService
            .getAllGroups()
            .then((res) => {
                if (isMounted) {
                    setGroups(res.data || res || []);
                }
            })
            .catch((err) => {
                console.error("Failed to load groups: ", err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    const {
        groupLeaderVisa = "",
        memberVisas = [],
        startDateFrom = "",
        startDateTo = "",
        endDateFrom = "",
        endDateTo = "",
    } = values;

    return (
        <div className={styles.advancedFilterPanel}>
            <Row>
                {/* Row 1: Project Leader Dropdown */}
                <Col md={6} sm={12} className={styles.filterFieldGroup}>
                    <label className={styles.filterLabel}>
                        <Translate content="projectList.leader" />
                    </label>
                    <Form.Control
                        as="select"
                        value={groupLeaderVisa}
                        onChange={(e) => onChange("groupLeaderVisa", e.target.value)}
                        className={styles.leaderSelect}
                    >
                        <option value="">
                            {counterpart.translate("projectList.selectLeader")}
                        </option>
                        {groups.map((g) => (
                            <option key={g.id} value={g.groupLeaderVisa}>
                                Group {g.id} - {g.groupLeaderVisa}
                                {g.groupLeaderName ? ` (${g.groupLeaderName})` : ""}
                            </option>
                        ))}
                    </Form.Control>
                </Col>

                {/* Row 1: Autocomplete Members */}
                <Col md={6} sm={12} className={styles.filterFieldGroup}>
                    <label className={styles.filterLabel}>
                        <Translate content="projectList.member" />
                    </label>
                    <MemberAutocomplete
                        value={memberVisas}
                        onChange={(visas) => onChange("memberVisas", visas)}
                        placeholder={counterpart.translate("projectList.memberPlaceholder")}
                    />
                </Col>
            </Row>

            <Row>
                {/* Row 2: Start Date Range */}
                <Col md={6} sm={12} className={styles.filterFieldGroup}>
                    <label className={styles.filterLabel}>
                        <Translate content="projectList.startDateRange" />
                    </label>
                    <div className={styles.dateRangeWrapper}>
                        <span className={styles.dateRangePrefix}>
                            <Translate content="projectList.dateFrom" />
                        </span>
                        <input
                            type="date"
                            value={startDateFrom}
                            onChange={(e) => onChange("startDateFrom", e.target.value)}
                            className={styles.dateInput}
                            aria-label="Start date from"
                        />
                        <span className={styles.dateRangePrefix}>
                            <Translate content="projectList.dateTo" />
                        </span>
                        <input
                            type="date"
                            value={startDateTo}
                            onChange={(e) => onChange("startDateTo", e.target.value)}
                            className={styles.dateInput}
                            aria-label="Start date to"
                        />
                    </div>
                </Col>

                {/* Row 2:  End Date Range */}
                <Col md={6} sm={12} className={styles.filterFieldGroup}>
                    <label className={styles.filterLabel}>
                        <Translate content="projectList.endDateRange" />
                    </label>
                    <div className={styles.dateRangeWrapper}>
                        <span className={styles.dateRangePrefix}>
                            <Translate content="projectList.dateFrom" />
                        </span>
                        <input
                            type="date"
                            value={endDateFrom}
                            onChange={(e) => onChange("endDateFrom", e.target.value)}
                            className={styles.dateInput}
                            aria-label="End date from"
                        />
                        <span className={styles.dateRangePrefix}>
                            <Translate content="projectList.dateTo" />
                        </span>
                        <input
                            type="date"
                            value={endDateTo}
                            onChange={(e) => onChange("endDateTo", e.target.value)}
                            className={styles.dateInput}
                            aria-label="End date to"
                        />
                    </div>
                </Col>
            </Row>

            {/* Inline Date Range Validation Error Banner */}
            {dateError && (
                <div className={styles.dateErrorMessage} role="alert">
                    <span role="img" aria-label="warning" className="mr-2">⚠️</span>
                    {dateError}
                </div>
            )}
        </div>
    );
}

ProjectAdvancedFilter.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    values: PropTypes.shape({
        groupLeaderVisa: PropTypes.string,
        memberVisas: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.instanceOf(Set),
        ]),
        startDateFrom: PropTypes.string,
        startDateTo: PropTypes.string,
        endDateFrom: PropTypes.string,
        endDateTo: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    dateError: PropTypes.string,
};

export default ProjectAdvancedFilter;