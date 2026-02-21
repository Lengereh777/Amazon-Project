import "./Registry.css";


const Registry = () => {
    return (

        <div className="registry-container">
            <div className="registry-header">
                <h1>Gift Registry</h1>
                <p>Create and share your wishlist with friends and family</p>
            </div>
            <div className="registry-content">
                <div className="registry-card">
                    <div className="card-icon">📝</div>
                    <h2>Create a Registry</h2>
                    <p>Start building your personalized gift registry today</p>
                    <button className="registry-btn">Create Registry</button>
                </div>
                <div className="registry-card">
                    <div className="card-icon">🔍</div>
                    <h2>Find a Registry</h2>
                    <p>Search for registries from friends and family</p>
                    <button className="registry-btn">Find Registry</button>
                </div>
                <div className="registry-card">
                    <div className="card-icon">🎁</div>
                    <h2>My Registries</h2>
                    <p>View and manage your existing registries</p>
                    <button className="registry-btn">View Registries</button>
                </div>
            </div>
        </div>

    );
};

export default Registry;
