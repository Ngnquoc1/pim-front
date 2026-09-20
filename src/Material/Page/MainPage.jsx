import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ErrorScreen from "./ErrorScreen";
import Project from "./Project";
import SearchPage from "./SearchPage";
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
            <Col xl={1} />
            <Col xl={2}>
              <Sidebar />
            </Col>
            <Col xl={9}>
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/projects" element={<SearchPage />} />
                <Route path="/create-project" element={<Project />} />
                <Route path="/projects/new" element={<Project />} />
                <Route path="/projects/edit/:id" element={<Project />} />
                <Route path="/error" element={<ErrorScreen />} />
                <Route path="*" element={<ErrorScreen />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default MainPage;
