

import Routing from "./pages/Routing/Routing";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routing />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


