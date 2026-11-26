import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const { numOfCartItems } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success" to="/">
          FreshCart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {token && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categories">
                  Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/brands">
                  Brands
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link d-flex align-items-center gap-1"
                  to="/wishlist"
                >
                  <span>Wishlist</span>
                  {wishlistIds.length > 0 && (
                    <span className="badge rounded-pill bg-danger">
                      {wishlistIds.length}
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link d-flex align-items-center gap-1"
                  to="/cart"
                >
                  <span>Cart</span>
                  {numOfCartItems > 0 && (
                    <span className="badge rounded-pill bg-success">
                      {numOfCartItems}
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/allorders">
                  Orders
                </NavLink>
              </li>
            </ul>
          )}

          <div className="d-flex align-items-center gap-2 ms-auto">
            {token ? (
              <>
                <Link
                  to="/change-password"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Change Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-success btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-success btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}