import Image from "next/image";
import styles from './CtaBlock.module.scss';

const CtaBlock = () => {
  return (
    <div className={styles.ctablock}>
    <Image
      src="/diamond_logo.png"
      alt="CTA image"
      width={66}
      height={66}
      className={styles.ctablock__image}
    />
    <h2 className={styles.ctablock__headline}> Aenean vulputate quis est et pulvinar.</h2>
    <p className={styles.ctablock__paragraph}>Maecenas dapibus turpis id purus mollis aliquam. Sed facilisis nec ipsum nec rutrum.Maecenas dapibus turpis id purus mollis aliquam. Sed facilisis nec ipsum nec rutrum.Maecenas dapibus turpis id purus mollis aliquam. Sed facilisis nec ipsum nec .</p>
    <button className={styles.ctablock__button}>About Us</button>
  </div>
  );
};

export default CtaBlock;
