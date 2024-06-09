import styles from './ColumnsContainer.module.scss';

const ColumnsContainer = () => {
  const columns = [
    {
      headline: 'Financial statements',
      paragraph: 'TMorbi purus libero, elementum nec gravida ac, commodo at erat. Etiam porta ipsum sed diam aliquam, rutrum tincidunt metus mattis.Morbi purus libero, Morbi purus libero, elementum nec '
    },
    {
      headline: 'Press releases',
      paragraph: 'TMorbi purus libero, elementum nec gravida ac, commodo at erat. Etiam porta ipsum sed diam aliquam, rutrum tincidunt metus mattis.Morbi purus libero, Morbi purus libero, elementum nec '
    },
    {
      headline: 'Webcast links',
      paragraph: 'TMorbi purus libero, elementum nec gravida ac, commodo at erat. Etiam porta ipsum sed diam aliquam, rutrum tincidunt metus mattis.Morbi purus libero, Morbi purus libero, elementum nec '
    },
    {
      headline: 'Corporate governance',
      paragraph: 'TMorbi purus libero, elementum nec gravida ac, commodo at erat. Etiam porta ipsum sed diam aliquam, rutrum tincidunt metus mattis.Morbi purus libero, Morbi purus libero, elementum nec '
    }
  ];

  return (
    <div className={styles.columns_container}>
      {columns.map((column, index) => (
        <div key={index} className={styles.column}>
          <div className={styles.icon}>
          </div>
          <div className={styles.headline}>{column.headline}</div>
          <div className={styles.content}>
            <p className={styles.paragraph}>{column.paragraph}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColumnsContainer;
