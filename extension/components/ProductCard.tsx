import React from 'react';
import { ProductInfo, formatPrice, getSourceDisplayName, getSourceIcon } from '../utils/productExtractor';

interface ProductCardProps {
  product: ProductInfo;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="flex">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'icons/image-placeholder.png';
            }}
          />
        ) : (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        <div className="product-details">
          <p className="product-title">{product.title}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="product-supplier">
            {getSourceIcon(product.source)} {getSourceDisplayName(product.source)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;