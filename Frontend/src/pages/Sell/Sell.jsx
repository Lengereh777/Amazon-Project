import "./Sell.css";

const Sell = () => {
    const steps = [
        { step: 1, title: "Register", description: "Create your seller account" },
        { step: 2, title: "List Products", description: "Add your products to the catalog" },
        { step: 3, title: "Manage Inventory", description: "Keep track of your stock" },
        { step: 4, title: "Get Paid", description: "Receive payments for your sales" },
    ];

    return (
        <div className="sell-container">
            <div className="sell-header">
                <h1>Start Selling on Amazon</h1>
                <p>Join millions of sellers and grow your business</p>
            </div>

            <div className="sell-benefits">
                <h2>Why Sell with Us?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <span className="benefit-icon">🌍</span>
                        <h3>Global Reach</h3>
                        <p>Access millions of customers worldwide</p>
                    </div>
                    <div className="benefit-card">
                        <span className="benefit-icon">📊</span>
                        <h3>Analytics</h3>
                        <p>Track sales and performance with detailed reports</p>
                    </div>
                    <div className="benefit-card">
                        <span className="benefit-icon">🚀</span>
                        <h3>Growth</h3>
                        <p>Scale your business with our tools</p>
                    </div>
                </div>
            </div>

            <div className="sell-steps">
                <h2>How It Works</h2>
                <div className="steps-container">
                    {steps.map((item) => (
                        <div key={item.step} className="step-item">
                            <div className="step-number">{item.step}</div>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sell-cta">
                <button className="sell-btn">Register as a Seller</button>
            </div>
        </div>
    );
};

export default Sell;
