import { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavigationItems = () => {
    const items = [
      {
        path: "/about",
        icon: <i className="fas fa-info-circle"></i>,
        label: "About",
        title: "About",
      },
    ];

    if (isLoggedIn) {
      items.push(
        {
          path: "/favorite-cards",
          icon: <i className="fas fa-heart"></i>,
          label: "Favorites",
          title: "My favorite cards",
        },
        {
          path: "/my-cards",
          icon: <i className="fas fa-id-card"></i>,
          label: "My-Cards",
          title: "my-cards",
        }
      );

      items.push({
        path: "/new-card",
        icon: <i className="fas fa-plus"></i>,
        label: "New-Card",
        title: "Create a new card",
      });

      if (user && user.isAdmin) {
        items.push({
          path: "/admin",
          icon: <i className="fas fa-users-cog"></i>,
          label: "CRM",
          title: "management area",
        });
      }
    }

    return items;
  };

  const navItems = getNavigationItems();

  return (
    <footer className="footer-nav fixed-bottom bg-secondary-subtle border-top py-2" style={{
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div className="container">
        <div className="d-flex justify-content-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`footer-nav-item text-center ${
                isActive(item.path) ? "active" : ""
              }`}
              title={item.title}
            >
              <div className={`icon-wrapper ${isActive(item.path) ? "active" : ""}`} style={{
                margin: '0 auto',
                height: '40px',
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s',
                backgroundColor: isActive(item.path) ? 'rgba(13, 110, 253, 0.1)' : 'transparent'
              }}>
                {item.icon}
              </div>
              <div className="footer-nav-label small" style={{ marginTop: '2px' }}>{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;