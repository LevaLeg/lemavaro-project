import React from 'react';
import s from './index.module.css';
import ProductCard from '../ProductCard';

function ProductsContainer({ products }) {

  return (
    <div className={s.container}>
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
}

export default ProductsContainer