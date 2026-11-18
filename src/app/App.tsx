import Footer from "../components/layout/Footer/Footer";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      {/* Site navigation will go here */}

      <main className={styles.main}>
        {/* Portfolio sections will go here */}

        <section id="home" className={styles.placeholder} aria-label="Home">
          <p className={styles.eyebrow}>PERSONAL UNIVERSE</p>

          <h1>Something extraordinary is taking shape.</h1>

          <p className={styles.description}>
            A universe of ideas, creativity, and code.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
