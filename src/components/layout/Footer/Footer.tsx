import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Personal Universe.</p>
      <p>Designed and developed with curiosity.</p>
    </footer>
  );
}

export default Footer;
