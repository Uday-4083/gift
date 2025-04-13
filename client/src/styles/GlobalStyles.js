import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.fonts.secondary};
    color: ${theme.colors.text};
    background-color: #FAFAFA;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.primary};
    color: ${theme.colors.text};
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.secondary};
    }
  }

  .btn {
    font-family: ${theme.fonts.secondary};
    font-weight: 500;
    padding: 0.5rem 1.5rem;
    border-radius: ${theme.borderRadius.small};
    transition: ${theme.transitions.default};

    &:focus {
      box-shadow: none;
    }
  }

  .btn-primary {
    background-color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};

    &:hover, &:focus {
      background-color: ${theme.colors.primary}ee;
      border-color: ${theme.colors.primary}ee;
    }
  }

  .btn-outline-primary {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};

    &:hover {
      background-color: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
    }
  }

  .card {
    border: none;
    border-radius: ${theme.borderRadius.medium};
    box-shadow: ${theme.shadows.small};
  }

  .form-control, .form-select {
    font-family: ${theme.fonts.secondary};
    border-radius: ${theme.borderRadius.small};
    padding: 0.75rem 1rem;
    border-color: #E0E0E0;
    transition: ${theme.transitions.default};

    &:focus {
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 0.2rem ${theme.colors.primary}22;
    }
  }

  .table {
    --bs-table-hover-bg: ${theme.colors.primary}11;
  }

  // Add padding to main content to account for fixed header
  main {
    padding-top: ${theme.spacing.headerHeight};
    min-height: calc(100vh - ${theme.spacing.footerHeight});
  }

  // Custom scrollbar
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary}88;
    border-radius: 4px;

    &:hover {
      background: ${theme.colors.primary};
    }
  }
`

export default GlobalStyles 