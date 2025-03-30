import { FunctionComponent, memo } from "react";
import { useTheme } from "./context/ThemeContext";

const ThemeToggle: FunctionComponent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="btn btn-link p-0 ms-2"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? "עבור למצב בהיר" : "עבור למצב כהה"}
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
    </button>
  );
};

export default memo(ThemeToggle);