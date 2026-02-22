const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate configuration
if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not found. Database operations will use mock data.')
}

// Create Supabase client with service role for backend operations
const supabase = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null

// Create client with anon key for user-context operations
const supabaseClient = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Database helper functions

// Products
const getProducts = async (filters = {}) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters.category) {
        query = query.eq('category', filters.category)
    }
    if (filters.featured) {
        query = query.eq('is_featured', true)
    }
    if (filters.limit) {
        query = query.limit(filters.limit)
    }
    if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
    }

    return await query
}

const getProductById = async (id) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
}

const createProduct = async (productData) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()
}

const updateProduct = async (id, updates) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
}

const deleteProduct = async (id) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('products')
        .delete()
        .eq('id', id)
}

// Users
const getUserById = async (id) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
}

const updateUser = async (id, updates) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
}

// Cart
const getCartItems = async (userId) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      product_id,
      products (*)
    `)
        .eq('user_id', userId)
}

const addToCart = async (userId, productId, quantity = 1) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    // Check if item already exists
    const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single()

    if (existing) {
        // Update quantity
        return await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)
            .select()
            .single()
    }

    // Insert new item
    return await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity })
        .select()
        .single()
}

const updateCartItem = async (cartItemId, quantity) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    if (quantity <= 0) {
        return await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId)
    }

    return await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single()
}

const removeFromCart = async (cartItemId) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
}

const clearCart = async (userId) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
}

// Orders
const getOrders = async (userId) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
}

const getOrderById = async (orderId, userId) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single()
}

const createOrder = async (orderData, items) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    // Start a transaction-like operation
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

    if (orderError) {
        return { data: null, error: orderError }
    }

    // Insert order items
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        // Try to cleanup the order
        await supabase.from('orders').delete().eq('id', order.id)
        return { data: null, error: itemsError }
    }

    return { data: order, error: null }
}

const updateOrderStatus = async (orderId, status) => {
    if (!supabase) {
        return { data: null, error: { message: 'Supabase not configured' } }
    }

    return await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single()
}

// Auth helpers for backend
const verifyToken = async (token) => {
    if (!supabase) {
        return { user: null, error: { message: 'Supabase not configured' } }
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    return { user, error }
}

const getUserFromToken = async (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.split(' ')[1]
    const { user, error } = await verifyToken(token)

    if (error || !user) {
        return null
    }

    return user
}

module.exports = {
    supabase,
    supabaseClient,
    // Products
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Users
    getUserById,
    updateUser,
    // Cart
    getCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    // Orders
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    // Auth
    verifyToken,
    getUserFromToken
}
