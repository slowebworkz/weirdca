import { CarouselPrev } from "./CarouselPrev";
import { CarouselNext } from "./CarouselNext";
import styles from "./Carousel.module.css";

export const Carousel = () => {
  return (
    <article className={styles.carousel}>
      <div className={styles.body}>
        <CarouselPrev />
        <CarouselNext />

        <div className={`${styles.slider} bg-amber-700`}></div>
      </div>
    </article>
  );
};
