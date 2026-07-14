import { createTheme } from '@mui/material/styles';

// Create a custom Material UI Theme for Application Hub
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED', // Electric Violet (Linear-like)
      light: '#A78BFA',
      dark: '#5B21B6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4', // Cyber Cyan (Stripe-like)
      light: '#22D3EE',
      dark: '#0891B2',
      contrastText: '#0A0B0D',
    },
    background: {
      default: '#030303', // Solid dark canvas background
      paper: '#0D0E12',   // Premium dark slate for panels
    },
    text: {
      primary: '#F3F4F6', // Near white
      secondary: '#9CA3AF', // Cool grey
      disabled: '#4B5563',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
    action: {
      active: '#9CA3AF',
      hover: 'rgba(255, 255, 255, 0.04)',
      selected: 'rgba(255, 255, 255, 0.08)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Outfit', 'Inter', sans-serif",
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#030303',
          color: '#F3F4F6',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0D0E12',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(13, 14, 18, 0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 12,
          backgroundImage: 'none',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.12)',
            backgroundColor: 'rgba(20, 22, 28, 0.6)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          color: '#F3F4F6',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
          },
        },
        text: {
          color: '#9CA3AF',
          '&:hover': {
            color: '#F3F4F6',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)',
            color: '#FFFFFF',
            '&:hover': {
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              boxShadow: '0 6px 20px 0 rgba(124, 58, 237, 0.45)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            boxShadow: '0 4px 14px 0 rgba(6, 182, 212, 0.3)',
            color: '#0A0B0D',
            '&:hover': {
              background: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
              boxShadow: '0 6px 20px 0 rgba(6, 182, 212, 0.45)',
            },
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.06)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7C3AED',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(13, 14, 18, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          padding: '16px 20px',
        },
        head: {
          fontWeight: 600,
          color: '#9CA3AF',
          backgroundColor: 'rgba(13, 14, 18, 0.6)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        outlined: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});
