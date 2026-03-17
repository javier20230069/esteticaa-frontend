// src/components/client/ProductDetail.tsx
import { useState } from 'react';
import { ArrowLeft, Package, CheckCircle2, XCircle } from 'lucide-react';
import './ProductDetail.css';

interface Producto {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  stock: number;
  image_url?: string;
}

interface ProductDetailProps {
  product: Producto;
  onBack: () => void;
  getImageUrl: (url?: string) => string | null;
}

const ProductDetail = ({ product, onBack, getImageUrl }: ProductDetailProps) => {
  const [cantidad, setCantidad] = useState(1);

  const aumentarCantidad = () => {
    if (cantidad < product.stock) setCantidad(cantidad + 1);
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  // 🌟 AQUÍ ESTÁ LA MAGIA: Calculamos el total en tiempo real
  const precioTotal = Number(product.price) * cantidad;

  return (
    <div className="saas-product-detail animation-fade-in">
      <button className="btn-back-catalog" onClick={onBack}>
        <ArrowLeft size={18} /> Volver al catálogo
      </button>
      
      <div className="detail-saas-grid">
        {/* FOTO GRANDE */}
        <div className="detail-image-box">
          {getImageUrl(product.image_url) ? (
            <img src={getImageUrl(product.image_url)!} alt={product.name} />
          ) : (
            <div className="no-image-placeholder">
              <Package size={48} />
              <span>Sin imagen disponible</span>
            </div>
          )}
        </div>

        {/* INFORMACIÓN Y COMPRA */}
        <div className="detail-info-box">
          <span className="saas-badge-brand">{product.brand}</span>
          <h2 className="detail-title">{product.name}</h2>
          <p className="detail-sku">SKU: PROD-{product.id} | Vendido por Ezequiel Castillo</p>
          
          <div className="detail-price-section">
            {/* 🌟 Mostramos el Precio Total dinámico */}
            <h3 className="detail-price text-emerald">${precioTotal.toFixed(2)}</h3>
            
            {/* 🌟 Si lleva más de 1, le decimos a cuánto le sale cada uno */}
            {cantidad > 1 && (
              <p className="detail-tax-info" style={{ color: '#4f46e5', fontWeight: 600 }}>
                (${Number(product.price).toFixed(2)} c/u)
              </p>
            )}
            
            <p className="detail-tax-info">Precio de contado con IVA incluido</p>
          </div>

          <div className="detail-stock-info">
            {product.stock > 0 ? (
              <span className="stock-status available"><CheckCircle2 size={16}/> Disponible ({product.stock} en stock)</span>
            ) : (
              <span className="stock-status empty"><XCircle size={16}/> Agotado</span>
            )}
          </div>

          {/* SELECTOR DE CANTIDAD Y BOTÓN */}
          {product.stock > 0 && (
            <div className="detail-cart-section">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="qty-controls">
                  <button type="button" onClick={disminuirCantidad} disabled={cantidad <= 1}>-</button>
                  <input type="number" value={cantidad} readOnly />
                  <button type="button" onClick={aumentarCantidad} disabled={cantidad >= product.stock}>+</button>
                </div>
              </div>

              <button className="btn-saas-primary btn-massive" onClick={() => alert(`Agregaste ${cantidad} ${product.name} al carrito por $${precioTotal.toFixed(2)}`)}>
                Agregar al carrito - ${precioTotal.toFixed(2)}
              </button>
            </div>
          )}

          <div className="detail-features">
            <h4>Acerca de este producto</h4>
            <ul>
              <li><strong>Marca:</strong> {product.brand}</li>
              <li><strong>Categoría:</strong> {product.category}</li>
              <li><strong>Condición:</strong> Nuevo, en empaque original</li>
              <li><strong>Envío:</strong> Recógelo en sucursal o envío a domicilio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;