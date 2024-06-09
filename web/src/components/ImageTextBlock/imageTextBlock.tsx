import Image from "next/image";
import styles from './imageTextBlock.module.scss';

const ImageTextBlock = () => {
  return (
    <div className={styles.image_textblock}>
      <Image
        src="/single-oil-field.png"
        alt="Image description"
        width={400}
        height={300}
        className={styles.image_textblock__image}
      />
      <div className={styles.image_textblock__content}>
        <h2 className={styles.image_textblock__headline}>Usce arcu turpis, vehicula in elementum tincidunt, faucibus at ligula.</h2>
        <p className={styles.image_textblock__paragraph}> <strong>Proin pharetra lectus non felis vulputate, nec commodo quam mattis. Donec fermentum diam eget sem placerat vestibulum. Donec consectetur ut leo quis feugiat. </strong> </p>
        <p className={styles.image_textblock__paragraph}>Phasellus quis dignissim lectus. Maecenas dolor ex, pulvinar in vestibulum eu, condimentum sit amet lacus. Fusce ex augue, facilisis ut ligula vitae, fringilla dictum sem. Donec tempus blandit nulla vel auctor. Donec non vestibulum tellus, sit amet condimentum felis. Maecenas scelerisque elit a lectus consequat tincidunt. </p>
        <div>
          <button className={styles.image_textblock__button}>Read about operations</button>
        </div>
      </div>
    </div>
  );
};

export default ImageTextBlock;
