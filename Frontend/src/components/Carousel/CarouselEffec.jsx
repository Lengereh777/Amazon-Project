import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./carousel.module.css";
import { images } from "./img/data";

function CarouselEffect() {
  return (
    <section className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-12">
          <div className={styles.wrapper}>
            <Carousel
              autoPlay
              infiniteLoop
              interval={5000}
              showThumbs={false}
              showIndicators={false}
              showStatus={false}
              swipeable
              emulateTouch
            >
              {images.map((img, index) => (
                <div key={index} className={styles.slide}>
                  <img src={img} alt={`slide-${index}`} className={styles.image} />
                  <div className={styles.overlay}></div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarouselEffect;
