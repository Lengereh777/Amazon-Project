import React, { useEffect, useState } from 'react';
import { getProducts } from '../../Api/api';
import ProductCard from './ProductCard';
import classes from './product.module.css';

function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const { data } = await getProducts();
        console.log('Products received:', data);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  console.log('Rendering Product component with products:', products);

  return (
    <section className={classes.products_container}>
      {products.length > 0 ? (
        products.map((singleProduct) => (
          <ProductCard
            key={singleProduct.id}
            product={singleProduct}
          />
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No products available</p>
        </div>
      )}
    </section>
  );
}

export default Product;
