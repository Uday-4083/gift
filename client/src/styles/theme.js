export const theme = {
  colors: {
    primary: '#C4A484', // Brand brown color
    secondary: '#F5B7B1', // Brand pink color
    background: '#FFFFFF',
    text: '#2C3E50',
    lightText: '#7F8C8D',
    success: '#2ECC71',
    danger: '#E74C3C',
    warning: '#F1C40F',
    info: '#3498DB'
  },
  fonts: {
    primary: "'Playfair Display', serif", // Elegant serif font for headings
    secondary: "'Lato', sans-serif", // Clean sans-serif for body text
  },
  spacing: {
    headerHeight: '80px',
    footerHeight: '250px',
    sectionPadding: '4rem',
    containerWidth: '1200px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)'
  },
  transitions: {
    default: '0.3s ease-in-out'
  }
}

export const adminTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    sidebar: '#2C3E50',
    sidebarText: '#ECF0F1',
    cardBg: '#FFFFFF'
  }
}

export const merchantTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    accent: '#8E44AD'
  }
} 