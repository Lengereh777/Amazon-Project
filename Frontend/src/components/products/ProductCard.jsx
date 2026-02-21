import React from 'react';
import Rating from '@mui/material/Rating';
import CurrencyFormat from './CurrencyFormat/CurrencyFormat';
import classes from './ProductCard.module.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const { image, title, id, rating, price } = product;
    const { addToCart, clearCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({
            id,
            title,
            price,
            image,
            rating,
            quantity: 1
        });
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        // Clear cart and add only this product to prepare for checkout
        clearCart();
        addToCart({
            id,
            title,
            price,
            image,
            rating,
            quantity: 1
        });
        // Navigate to checkout
        navigate("/payment");
    };

    const handleProductClick = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div className={`${classes.card__container}`}>
            <a href="" onClick={handleProductClick}>
                <img src={image} alt={title} />
            </a>
            <div>
                <h3>{title}</h3>
                <div className={classes.rating}>
                    <Rating value={rating.rate} precision={0.1} readOnly />
                    <small>{rating.count}</small>
                </div>
                <div>
                    <CurrencyFormat amount={price} />
                </div>
                <div className={classes.buttonContainer}>
                    <button
                        className={classes.button}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                    <button
                        className={`${classes.button} ${classes.buyNowButton}`}
                        onClick={handleBuyNow}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
