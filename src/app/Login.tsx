import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Layers as LogoIcon, Microsoft as MicrosoftIcon } from '@mui/icons-material';
import { useAuth } from '../shared/hooks/useAuth';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const AnyButton = Button as any;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
        bgcolor: '#030303',
      }}
    >
      <Box className="bg-grid" />

      {/* Decorative Blur Spheres */}
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(40px)',
          zIndex: -1,
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          maxWidth: 420,
          width: '100%',
          zIndex: 1,
        }}
      >
        <Paper
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(13, 14, 18, 0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 4,
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8)',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 3,
            }}
          >
            <LogoIcon sx={{ color: 'primary.light', fontSize: 30 }} />
          </Box>

          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em',
              mb: 1,
              color: '#FFFFFF',
            }}
          >
            Application Hub
          </Typography>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 4, px: 2, lineHeight: 1.5 }}
          >
            Enterprises portal for tools directory, cloud resource provisioning, and secure service integrations.
          </Typography>

          {error && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{
                width: '100%',
                mb: 3,
                bgcolor: 'rgba(239, 68, 68, 0.05)',
                borderColor: 'rgba(239, 68, 68, 0.2)',
                color: 'error.light',
                fontSize: '0.8rem',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Action */}
          <AnyButton
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? null : <MicrosoftIcon />}
            sx={{
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
              bgcolor: '#FFFFFF',
              color: '#0A0B0D',
              border: '1px solid #FFFFFF',
              boxShadow: '0 4px 20px 0 rgba(255, 255, 255, 0.05)',
              '&:hover': {
                bgcolor: '#E5E7EB',
                borderColor: '#E5E7EB',
                boxShadow: '0 6px 24px 0 rgba(255, 255, 255, 0.1)',
              },
              '&:disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Opening Microsoft Auth...' : 'Sign in with Microsoft'}
          </AnyButton>

          {/* Disclaimer / Privacy Info */}
          <Typography
            variant="caption"
            color="text.disabled"
            align="center"
            sx={{ mt: 4, display: 'block', fontSize: '0.7rem', px: 1 }}
          >
            Secure SSO integration managed under Microsoft Entra ID directory credentials.
          </Typography>
        </Paper>
      </Box>

      {/* Footer Branding */}
      <Box sx={{ position: 'absolute', bottom: 24, zIndex: 1, opacity: 0.4 }}>
        <Typography variant="caption" color="text.secondary">
          © 2026 Application Hub. Enterprise Portal.
        </Typography>
      </Box>
    </Box>
  );
};
