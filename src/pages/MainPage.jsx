import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorScreen from "./ErrorScreen";
import Project from "./Project";
import SearchPage from "./SearchPage";
import { ROUTES } from "../constants/routes";

function MainPage() {
  return (
    <Router>
      <div className="main">
        <Container fluid>
          <Row>
            <Col>
              <Header />
            </Col>
          </Row>

          <Row>
            <Col xl={1} className="d-none d-xl-block" />
            <Col xl={2} lg={3} md={3} sm={12} xs={12} className="mb-3 mb-md-0">
              <Sidebar />
            </Col>
            <Col xl={8} lg={9} md={9} sm={12} xs={12}>
              <Routes>
                <Route path={ROUTES.HOME} element={<SearchPage />} />
                <Route path={ROUTES.PROJECTS} element={<SearchPage />} />
                <Route path={ROUTES.CREATE_PROJECT} element={<Project />} />
                <Route path={ROUTES.PROJECTS_NEW} element={<Project />} />
                <Route path={ROUTES.PROJECTS_EDIT} element={<Project />} />
                <Route path={ROUTES.ERROR} element={<ErrorScreen />} />
                <Route path="*" element={<ErrorScreen />} />
              </Routes>
            </Col>
            <Col xl={1} className="d-none d-xl-block" />
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default MainPage;
