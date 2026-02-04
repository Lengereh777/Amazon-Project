import { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import "./Admin.css";
import { FaPlus, FaEdit, FaCopy, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import {
    getProductsAdmin,
    duplicateProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../Api/api";
import CurrencyFormat from "../../components/products/CurrencyFormat/CurrencyFormat";

function Admin() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        image: ""
    });

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const { data } = await getProductsAdmin();
                console.log('Fetched products:', data);
                setProducts(data);
            } catch (err) {
                setError("Error fetching products: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle product creation
    const handleCreateProduct = async (e) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                rating: { rate: 0, count: 0 },
                isDuplicate: false
            };

            const result = await createProduct(productData);

            if (result?.success) {
                setSuccess("Product created successfully!");
                setShowCreateModal(false);
                resetForm();

                // Refresh products list
                const { data: productsData } = await getProductsAdmin();
                setProducts(productsData);
            } else {
                setError("Failed to create product: " + (result?.error || "Unknown error"));
            }
        } catch (err) {
            setError("Error creating product: " + err.message);
        }
    };

    // Handle product duplication
    const handleDuplicateProduct = async (product) => {
        try {
            const result = await duplicateProduct(
                product.id,
                `Copy of ${product.title}`,
                product.price
            );

            if (result?.success) {
                setSuccess("Product duplicated successfully!");

                // Refresh products list
                const { data: productsData } = await getProductsAdmin();
                setProducts(productsData);
            } else {
                setError("Failed to duplicate product: " + (result?.error || "Unknown error"));
            }
        } catch (err) {
            setError("Error duplicating product: " + err.message);
        }
    };

    // Handle product edit
    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setFormData({
            title: product.title,
            price: product.price.toString(),
            description: product.description || "",
            category: product.category || "",
            image: product.image || ""
        });
        setShowEditModal(true);
    };

    // Handle update product
    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const updates = {
                ...formData,
                price: parseFloat(formData.price)
            };

            const result = await updateProduct(selectedProduct.id, updates);

            if (result?.success) {
                setSuccess("Product updated successfully!");
                setShowEditModal(false);
                resetForm();

                // Refresh products list
                const { data: productsData } = await getProductsAdmin();
                setProducts(productsData);
            } else {
                setError("Failed to update product: " + (result?.error || "Unknown error"));
            }
        } catch (err) {
            setError("Error updating product: " + err.message);
        }
    };

    // Handle product deletion
    const handleDeleteProduct = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    // Confirm delete product
    const confirmDeleteProduct = async () => {
        try {
            const result = await deleteProduct(selectedProduct.id);

            if (result?.success) {
                setSuccess("Product deleted successfully!");
                setShowDeleteModal(false);

                // Refresh products list
                const { data: productsData } = await getProductsAdmin();
                setProducts(productsData);
            } else {
                setError("Failed to delete product: " + (result?.error || "Unknown error"));
            }
        } catch (err) {
            setError("Error deleting product: " + err.message);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            price: "",
            description: "",
            category: "",
            image: ""
        });
        setSelectedProduct(null);
    };

    // Close modals
    const closeModal = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        resetForm();
        setError(null);
        setSuccess(null);
    };

    if (loading) {
        return (
            <Layout title="Admin Panel">
                <div className="admin-container">
                    <div className="loading">Loading products...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Admin Panel">
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <h1>Product Management</h1>
                    <div className="admin-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FaPlus /> Add Product
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="error">
                        <FaTimes /> {error}
                    </div>
                )}
                {success && (
                    <div className="success">
                        <FaCheck /> {success}
                    </div>
                )}

                {/* Products Grid */}
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-header">
                                <div className="product-info">
                                    <h3 className="product-title">{product.title}</h3>
                                    <div className="product-price">
                                        <CurrencyFormat amount={product.price} />
                                    </div>
                                </div>
                            </div>

                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}

                            <div className="product-meta">
                                <span>Category: {product.category || 'N/A'}</span>
                                {product.isDuplicate && (
                                    <span style={{ color: '#c45500' }}>
                                        Duplicate
                                    </span>
                                )}
                            </div>

                            <div className="product-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDuplicateProduct(product)}
                                >
                                    <FaCopy /> Duplicate
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteProduct(product)}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Product Modal */}
                <div className={`modal ${showCreateModal ? 'active' : ''}`} onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Product</h2>
                            <span className="close" onClick={closeModal}>×</span>
                        </div>

                        <form onSubmit={handleCreateProduct}>
                            <div className="form-group">
                                <label htmlFor="title">Product Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">Image URL</label>
                                <input
                                    type="text"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Edit Product Modal */}
                <div className={`modal ${showEditModal ? 'active' : ''}`} onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Product</h2>
                            <span className="close" onClick={closeModal}>×</span>
                        </div>

                        <form onSubmit={handleUpdateProduct}>
                            <div className="form-group">
                                <label htmlFor="title">Product Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">Image URL</label>
                                <input
                                    type="text"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Delete Product Modal */}
                <div className={`modal ${showDeleteModal ? 'active' : ''}`} onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Delete Product</h2>
                            <span className="close" onClick={closeModal}>×</span>
                        </div>

                        <div className="delete-confirm">
                            <p>Are you sure you want to delete this product?</p>
                            <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                                {selectedProduct?.title}
                            </p>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDeleteProduct}>
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Admin;
