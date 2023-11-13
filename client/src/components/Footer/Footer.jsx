import React from "react";
import styles from "./Footer.module.css";

const Footer = ({ currentLanguage }) => {
  const getAuthorName = (language) => {
    return language === "ENG" ? "Viktor Sh." : "Виктор Ш.";
  };

  const author = getAuthorName(currentLanguage);
  const email = "shvs@cbi-info.ru";
  const year = new Date().getFullYear();
  return (
    <div className={styles.footer}>{`${author} Mail: ${email}. ${year}`}</div>
  );
};

export default Footer;
