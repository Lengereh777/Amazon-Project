
import { FaFire, FaClock, FaShoppingCart } from "react-icons/fa";
import "./Deals.css";

const Deals = () => {
    const deals = [
        { id: 1, name: "Premium Headphones", price: 25, original: 50, discount: 50, icon: "🎧" },
        { id: 2, name: "Smart Watch", price: 35, original: 50, discount: 30, icon: "⌚" },
        { id: 3, name: "Wireless Speaker", price: 45, original: 75, discount: 40, icon: "🔊" },
        { id: 4, name: "USB-C Cable", price: 8, original: 15, discount: 47, icon: "🔌" },
        { id: 5, name: "Phone Stand", price: 12, original: 20, discount: 40, icon: "📱" },
        { id: 6, name: "Screen Protector", price: 5, original: 10, discount: 50, icon: "🛡️" },
    ];

    return (
        <div className="deals-container">
            <div className="deals-header">
                <div className="header-content">
                    <FaFire className="fire-icon" />
                    <h1>Today's Hot Deals</h1>
                    <p>Limited time offers - Save big on electronics and gadgets!</p>
                    <div className="deal-badge-info">
                        <FaClock /> Deals ending soon - Shop now!
                    </div>
                </div>
            </div>

            <div className="deals-grid">
                {deals.map((deal) => (
                    <div key={deal.id} className="deal-card">
                        <div className="deal-badge flash">{deal.discount}% OFF</div>
                        <div className="product-icon">{deal.icon}</div>
                        <img src={`https://via.placeholder.com/200?text=${deal.name}`} alt={deal.name} className="product-image" />
                        <div className="card-content">
                            <h3>{deal.name}</h3>
                            <div className="price-section">
                                <span className="original-price">${deal.original}.00</span>
                                <span className="deal-price">${deal.price}.00</span>
                            </div>
                            <button className="deal-btn">
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div> // This closes deals-container
    ); // This closes the return statement
}; // This closes the Deals component

export default Deals;
