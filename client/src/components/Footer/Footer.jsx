import React from "react";
import styles from "./Footer.module.css";

const Footer = ({ currentLanguage }) => {
  const author = currentLanguage === "ENG" ? "Viktor Sh." : "Виктор Ш.";
  const email = "shvs@cbi-info.ru";
  const year = 2023;

  return (
    <div className={styles.footer}>{`${author} Mail: ${email}. ${year}`}</div>
  );
};

export default Footer;
