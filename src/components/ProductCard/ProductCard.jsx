import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card h-100 shadow-sm border-0">
      <Link
        to={`/products/${product._id}`}
        className="text-decoration-none text-dark"
      >
        <img
          src={product.imageCover}
          className="card-img-top p-3"
          alt={product.title}
          style={{ height: "200px", objectFit: "contain" }}
        />
        <div className="card-body pb-2">
          <span className="text-success small fw-semibold d-block mb-1">
            {product.category?.name}
          </span>
          <h6 className="card-title fw-bold text-truncate" title={product.title}>
            {product.title}
          </h6>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="fw-bold text-dark">{product.price} EGP</span>
            <span className="text-warning small fw-semibold">
              ★ {product.ratingsAverage}
            </span>
          </div>
        </div>
      </Link>
      <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
       <button
  type="button"
  onClick={() => addToCart(product._id)}
  className="btn btn-success btn-sm flex-grow-1 fw-semibold"
>
  + Add to Cart
</button>
      </div>
    </div>
  );
}