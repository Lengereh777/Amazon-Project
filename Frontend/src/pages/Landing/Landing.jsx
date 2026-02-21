import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import Category from "../../components/Category/Category"
import Carousel from "../../components/Carousel/CarouselEffec"
import Footer from "../../components/Footer/Footer";
import Product from "../../components/products/Product";

function Landing() {
  console.log('Landing component rendering');

  return (
    <Layout>
      {/* Carousel */}
      <Carousel />

      {/* Categories */}
      <Category />

      {/* Products */}
      <Product />

      {/* Footer */}
      <Footer />
    </Layout>
  );
}

export default Landing;
