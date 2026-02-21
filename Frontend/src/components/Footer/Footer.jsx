import "./Footer.css";

const Footer = () => {
  return (
    <footer className="amz-footer">
      {/* BACK TO TOP */}
      <div className="amz-footer-top">
        <a href="#">Back to top</a>
      </div>

      {/* LINKS */}
      <div className="amz-container">
        <div className="amz-footer-content">
          <div className="amz-footer-column">
            <h3>Get to Know Us</h3>
            <ul>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">About Amazon</a></li>
              <li><a href="#">Investor Relations</a></li>
              <li><a href="#">Amazon Science</a></li>
            </ul>
          </div>

          <div className="amz-footer-column">
            <h3>Make Money with Us</h3>
            <ul>
              <li><a href="#">Sell products on Amazon</a></li>
              <li><a href="#">Sell on Amazon Business</a></li>
              <li><a href="#">Sell apps on Amazon</a></li>
              <li><a href="#">Become an Affiliate</a></li>
              <li><a href="#">Advertise Your Products</a></li>
              <li><a href="#">Self-Publish with Us</a></li>
            </ul>
          </div>

          <div className="amz-footer-column">
            <h3>Amazon Payment</h3>
            <ul>
              <li><a href="#">Amazon Business Card</a></li>
              <li><a href="#">Shop with Points</a></li>
              <li><a href="#">Reload Your Balance</a></li>
              <li><a href="#">Amazon Currency Converter</a></li>
            </ul>
          </div>

          <div className="amz-footer-column">
            <h3>Let Us Help You</h3>
            <ul>
              <li><a href="#">Your Account</a></li>
              <li><a href="#">Your Orders</a></li>
              <li><a href="#">Shipping Rates & Policies</a></li>
              <li><a href="#">Returns & Replacements</a></li>
              <li><a href="#">Manage Your Content and Devices</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="amz-footer-bottom">
        <div className="amz-container">
          <div className="amz-footer-logo">Amazon Clone</div>
          <p className="amz-footer-copyright">© {new Date().getFullYear()} Amazon Clone. All rights reserved.</p>
          <div className="amz-footer-links">
            <a href="#">Conditions of Use</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Your Ads Privacy Choices</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
