import { useState } from "react";
import "./GiftCards.css";

const GiftCards = () => {
    const [cardAmount, setCardAmount] = useState(50);
    const [cardType, setCardType] = useState("eGift");

    const amounts = [10, 25, 50, 100, 250];

    return (
        <div className="giftcards-container">
            <div className="giftcards-header">
                <h1>Amazon Gift Cards</h1>
                <p>The perfect gift for any occasion</p>
            </div>

            <div className="giftcards-content">
                <div className="giftcards-features">
                    <div className="feature-card">
                        <div className="feature-icon">🎁</div>
                        <h3>Instant Delivery</h3>
                        <p>Send gift cards instantly via email or text message</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💝</div>
                        <h3>Customizable</h3>
                        <p>Add personal messages and choose designs for any occasion</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure</h3>
                        <p>100% guaranteed. Valid for all Amazon products and services</p>
                    </div>
                </div>

                <div className="giftcards-main">
                    <div className="giftcards-type">
                        <h2>Choose Gift Card Type</h2>
                        <div className="card-types">
                            <button
                                className={`card-type-btn ${cardType === "eGift" ? "active" : ""}`}
                                onClick={() => setCardType("eGift")}
                            >
                                eGift Card
                            </button>
                            <button
                                className={`card-type-btn ${cardType === "Physical" ? "active" : ""}`}
                                onClick={() => setCardType("Physical")}
                            >
                                Physical Gift Card
                            </button>
                            <button
                                className={`card-type-btn ${cardType === "Print" ? "active" : ""}`}
                                onClick={() => setCardType("Print")}
                            >
                                Print at Home
                            </button>
                        </div>
                    </div>

                    <div className="giftcards-amount">
                        <h2>Select Amount</h2>
                        <div className="amount-buttons">
                            {amounts.map((amount) => (
                                <button
                                    key={amount}
                                    className={`amount-btn ${cardAmount === amount ? "active" : ""}`}
                                    onClick={() => setCardAmount(amount)}
                                >
                                    ${amount}
                                </button>
                            ))}
                            <input
                                type="number"
                                className="custom-amount"
                                placeholder="Custom amount"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="giftcards-checkout">
                        <div className="checkout-summary">
                            <h3>Order Summary</h3>
                            <p>Gift Card Amount: <strong>${cardAmount}.00</strong></p>
                            <p>Delivery: <strong>{cardType === "eGift" ? "Instant" : "3-5 Days"}</strong></p>
                            <p>Card Type: <strong>{cardType}</strong></p>
                            <button className="checkout-btn">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiftCards;