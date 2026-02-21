import { useEffect, useState, useCallback } from "react";
import Layout from "../Layout/Layout";
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsByCategory, searchProducts } from "../../Api/api";
import ProductCard from "../../components/products/ProductCard";
import ProductFilter from "../../components/products/ProductFilter";

import classes from "./Results.module.css";

function Results() {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  const { categoryName } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      if (searchQuery) {
        console.log("Searching products for:", searchQuery);
        try {
          const result = await searchProducts(searchQuery);
          console.log("Search results fetched successfully:", result);

          if (isMounted) {
            if (result.error) {
              setError(result.error);
            } else {
              setResults(result.data);
              setFilteredResults(result.data);
            }
          }
        } catch (err) {
          console.error("Error searching products:", err);
          if (isMounted) {
            setError("Search failed. Please try again.");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (categoryName) {
        console.log("Fetching category products for:", categoryName);

        try {
          const result = await getProductsByCategory(categoryName);
          console.log("Category products fetched successfully:", result);

          if (isMounted) {
            if (result.error) {
              setError(result.error);
            } else {
              setResults(result.data);
              setFilteredResults(result.data);
            }
          }
        } catch (err) {
          console.error("Error loading products:", err);
          if (isMounted) {
            setError("Failed to load products.");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [categoryName, searchQuery]);

  const applyFilters = useCallback((filters) => {
    let filtered = [...results];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceMin && product.price <= filters.priceMax
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product =>
        product.rating?.rate >= filters.rating
      );
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock !== false);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'relevance':
      default:
        // Default sorting (relevance)
        break;
    }

    setFilteredResults(filtered);
  }, [results]);

  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);

  // Get unique categories for filter
  const categories = Array.from(new Set(results.map(product => product.category)));

  // Calculate price range
  const priceRange = results.length > 0 ? [
    Math.floor(Math.min(...results.map(p => p.price))),
    Math.ceil(Math.max(...results.map(p => p.price)))
  ] : [0, 500];

  return (
    <Layout>
      <section className={classes['results-section']}>
        <h1 className={classes['category-title']}>
          {searchQuery ? `Search Results for "${searchQuery}"` : `Category / ${categoryName}`}
        </h1>
        <p className={classes['category-subtitle']}>
          {filteredResults.length} {filteredResults.length === 1 ? 'product' : 'products'} found
        </p>
        <hr />

        {isLoading && (
          <p style={{ textAlign: "center", padding: "30px" }}>
            Loading products...
          </p>
        )}

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className={classes['results-content']}>
            <div className={classes['filters-section']}>
              <ProductFilter
                onFilterChange={handleFilterChange}
                initialFilters={activeFilters}
                categories={categories}
                priceRange={priceRange}
              />
            </div>

            <div className={classes['products-section']}>
              <div className={classes['products-container']}>
                {filteredResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className={classes['no-products-container']}>
                  <p>No products found. Try adjusting your filters.</p>
                  <button
                    className={classes['clear-filters-btn']}
                    onClick={() => handleFilterChange({
                      search: "",
                      category: "all",
                      priceMin: priceRange[0],
                      priceMax: priceRange[1],
                      rating: 0,
                      brand: "",
                      inStock: false,
                      sortBy: "relevance"
                    })}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

export default Results;
