import React from "react";
import Translate from "react-translate-component";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../Style/Header.module.css";
import logo from "../Images/logo_elca.png";
import { useLocale, useProjectActions } from "../../store/useProjectStore";

function Header() {
  const currentLocale = useLocale();
  const { setLocale } = useProjectActions();

  const handleLanguageChange = (locale) => {
    setLocale(locale);
  };

  return (
    <div className={styles.content}>
      <Container fluid>
        <Row className="align-items-center">
          <Col xl={1} />
          <Col xl={10} className="d-flex align-items-center justify-content-between">
            <div className={`d-flex align-items-center ${styles.headerBrand}`}>
              <img className={styles.logo} src={logo} alt="logo" />
              <p className={`m-0 ${styles.name}`}>
                <Translate content="header.name" />
              </p>
            </div>

            <div className={styles.headerRightActions}>
              <div className={styles.langSwitch}>
                <span
                  className={`${styles.langItem} ${
                    currentLocale === "en" ? styles.langActive : styles.langLink
                  }`}
                  onClick={() => handleLanguageChange("en")}
                >
                  EN
                </span>
                <span className={styles.langDivider}>|</span>
                <span
                  className={`${styles.langItem} ${
                    currentLocale === "fr" ? styles.langActive : styles.langLink
                  }`}
                  onClick={() => handleLanguageChange("fr")}
                >
                  FR
                </span>
              </div>

              <a
                href="#help"
                className={styles.helpLink}
                onClick={(e) => e.preventDefault()}
              >
                <Translate content="header.help" />
              </a>

              <a
                href="#logout"
                className={styles.logoutLink}
                onClick={(e) => e.preventDefault()}
              >
                <Translate content="header.logout" />
              </a>
            </div>
          </Col>
          <Col xl={1} />
        </Row>
      </Container>
    </div>
  );
}

export default Header;

