import { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
    cartItems: [],
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const CLEAR_CART = "CLEAR_CART";

// Reducer function
const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { product } = action.payload;

            // Validate product data
            if (!product || !product.id || !product.title || typeof product.price !== "number") {
                console.error("Invalid product data:", product);
                return state;
            }

            // Check if product already exists in cart
            const existingItem = state.cartItems.find(item => item.id === product.id);
            const quantityToAdd = product.quantity || 1;

            if (existingItem) {
                // Increase quantity if item exists
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantityToAdd }
                            : item
                    )
                };
            }

            // Add new item to cart
            return {
                ...state,
                cartItems: [...state.cartItems, { ...product, quantity: quantityToAdd }]
            };
        }

        case REMOVE_FROM_CART: {
            const { productId } = action.payload;
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== productId)
            };
        }

        case UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;

            // Validate quantity
            if (typeof quantity !== "number" || quantity < 0) {
                console.error("Invalid quantity:", quantity);
                return state;
            }

            if (quantity === 0) {
                // Remove item if quantity is 0
                return {
                    ...state,
                    cartItems: state.cartItems.filter(item => item.id !== productId)
                };
            }

            // Update quantity
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === productId
                        ? { ...item, quantity: quantity }
                        : item
                )
            };
        }

        case CLEAR_CART: {
            return {
                ...state,
                cartItems: []
            };
        }

        default:
            return state;
    }
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

// Cart provider component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Validate and load cart items
                if (Array.isArray(parsedCart)) {
                    // Clear existing cart first
                    dispatch({ type: CLEAR_CART });
                    // Add each item to cart
                    parsedCart.forEach(item => {
                        dispatch({ type: ADD_TO_CART, payload: { product: item } });
                    });
                }
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error);
                localStorage.removeItem("cart");
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    // Cart operations
    const addToCart = (product) => {
        console.log('CartContext: Adding to cart:', product);
        dispatch({ type: ADD_TO_CART, payload: { product } });
        // Note: state won't update immediately due to React's batch update behavior
    };

    const removeFromCart = (productId) => {
        dispatch({ type: REMOVE_FROM_CART, payload: { productId } });
    };

    const updateQuantity = (productId, quantity) => {
        dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: CLEAR_CART });
    };

    // Derived state
    const cartTotal = state.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const cartCount = state.cartItems.reduce((count, item) => {
        return count + item.quantity;
    }, 0);

    // Cart operations
    const getCartCount = () => {
        return state.cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    // Context value
    const value = {
        cartItems: state.cartItems,
        cartTotal,
        cartCount,
        getCartCount,
        getCartTotal: () => cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};