import React from 'react';
import { categoryInfos } from './CategoryInfos';
import CategoryCard from './CategoryCard';
import './Category.css';

function Category() {
  return (
    <section className="category__container">
      {
        categoryInfos.map((infos) => (
          <CategoryCard key={infos.title} data={infos} />
        ))
      }
    </section>
  );
}

export default Category;
