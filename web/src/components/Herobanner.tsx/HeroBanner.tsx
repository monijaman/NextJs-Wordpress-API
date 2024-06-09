import Image from "next/image";

import styles from "./herobanner.module.scss";

const Herobanner = () => {
  return (
    <section className={styles.herobanner}>
      <Image
        src="/clyde-thomas.jpg"
        alt="Hero banner image"
        layout="fill"
        objectFit="cover"
        className="hero-banner__image"
      />
      <div className={styles.herobanner__content}>
        <h1 className={styles.herobanner__content__title}>Lorem ipsum dolor sit amet, consec</h1>
        <p className={styles.herobanner__content__text}>Aliquam eu malesuada turpis, eu interdum nibh. Etiam tristique erat in ligula consequat malesuada. Praesent posuere vestibulum neque ac posuere. </p>
      </div>
    </section>
  );
};

export default Herobanner;
