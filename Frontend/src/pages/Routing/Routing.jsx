import { Routes, Route } from "react-router-dom";

import Landing from "../Landing/Landing";
import Payment from "../Payment/Payment";
import Orders from "../Orders/Orders";
import Results from "../Results/Results";
import Auth from "../Auth/Auth";
import Cart from "../Cart/Cart";
import ProductDetail from "../ProductDetail/ProductDetail";
import Ethiopia from "../Ethiopia/Ethiopia";
import ProPreview from "../ProPreview/ProPreview";
import Deals from "../Deals/Deals";
import GiftCards from "../GiftCards/GiftCards";
import Registry from "../Registry/Registry";
import Sell from "../Sell/Sell";
import Service from "../Service/Service";
import Admin from "../Admin/Admin";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";


function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/pro-preview" element={<ProPreview />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/service" element={<Service />} />
      <Route path="/registry" element={<Registry />} />
      <Route path="/gift-cards" element={<GiftCards />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/location" element={<Ethiopia />} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/category/:categoryName" element={<Results />} />
      <Route path="/search" element={<Results />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

    </Routes>
  );
}

export default Routing;














