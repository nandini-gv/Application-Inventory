import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Link } from '@mui/material';

export const MSLoginPopup: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: Pass/Pick, 3: Authenticating
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<{
    displayName: string;
    email: string;
    roles: string[];
    department: string;
    title: string;
  } | null>(null);

  const mockProfiles = [
    {
      displayName: 'Sarah Jenkins',
      email: 'sarah.jenkins@enterprise.com',
      roles: ['Administrator', 'Billing Manager'],
      department: 'Cloud Operations',
      title: 'Senior Director of Infrastructure',
    },
    {
      displayName: 'Alex Rivers',
      email: 'alex.rivers@enterprise.com',
      roles: ['Developer', 'Security Analyst'],
      department: 'Engineering',
      title: 'Staff Platform Engineer',
    },
  ];

  const handleNext = () => {
    if (!email) return;
    
    // Auto-match or use default
    const matched = mockProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setSelectedProfile(matched);
    } else {
      // Generate default developer profile for custom email
      const namePart = email.split('@')[0];
      const name = namePart
        .split('.')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
        
      setSelectedProfile({
        displayName: name || 'Enterprise User',
        email: email,
        roles: ['Developer'],
        department: 'Corporate',
        title: 'Associate engineer',
      });
    }
    setStep(2);
  };

  const selectPredefined = (profile: typeof mockProfiles[0]) => {
    setEmail(profile.email);
    setSelectedProfile(profile);
    setStep(2);
  };

  const handleSignIn = () => {
    setStep(3);

    // Simulate Azure AD validation delay
    setTimeout(() => {
      if (selectedProfile && window.opener) {
        // Send success message to parent
        window.opener.postMessage(
          {
            type: 'MSAL_LOGIN_SUCCESS',
            profile: selectedProfile,
            token: `mock-jwt-msal-token-${Math.random().toString(36).substring(2)}`,
          },
          window.location.origin
        );
      } else {
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'MSAL_LOGIN_FAILURE',
              error: 'Failed to retrieve profile credentials.',
            },
            window.location.origin
          );
        }
      }
    }, 1800);
  };

  const AnyTextField = TextField as any;
  const AnyButton = Button as any;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FFFFFF',
        color: '#242424',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        fontFamily: '"Segoe UI", -apple-system, sans-serif',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 440,
          p: 5.5,
          bgcolor: '#FFFFFF',
          color: '#242424',
          borderRadius: 0, // Microsoft style flat look
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid #E5E5E5',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Microsoft Logo Icon */}
        <Box sx={{ display: 'flex', gap: '2px', mb: 3 }}>
          <Box sx={{ width: 11, height: 11, bgcolor: '#F25022' }} />
          <Box sx={{ width: 11, height: 11, bgcolor: '#7FBA00' }} />
          <div style={{ clear: 'both' }} />
          <Box sx={{ width: 11, height: 11, bgcolor: '#00A4EF' }} />
          <Box sx={{ width: 11, height: 11, bgcolor: '#FFB900' }} />
        </Box>

        {step === 1 && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1B1B1B', fontSize: '1.5rem' }}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.9rem' }}>
              to continue to <b>Application Hub</b>
            </Typography>

            <AnyTextField
              fullWidth
              size="small"
              placeholder="Email, phone, or Skype"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': { borderColor: '#8A8A8A' },
                  '&:hover fieldset': { borderColor: '#242424' },
                  '&.Mui-focused fieldset': { borderColor: '#0067B8', borderWidth: 2 },
                },
              }}
            />

            {/* Predefined Selection */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
              Or quick select a mock profile:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3.5 }}>
              {mockProfiles.map((p) => (
                <AnyButton
                  key={p.email}
                  variant="outlined"
                  size="small"
                  onClick={() => selectPredefined(p)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    borderRadius: 0,
                    borderColor: '#D2D2D2',
                    color: '#242424',
                    textTransform: 'none',
                    py: 0.8,
                    px: 1.5,
                    bgcolor: '#F9F9F9',
                    '&:hover': {
                      bgcolor: '#EAEAEA',
                      borderColor: '#8A8A8A',
                    },
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                      {p.displayName} ({p.roles[0]})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.email}
                    </Typography>
                  </Box>
                </AnyButton>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AnyButton
                variant="contained"
                onClick={handleNext}
                disabled={!email}
                sx={{
                  bgcolor: '#0067B8',
                  color: '#FFFFFF',
                  borderRadius: 0,
                  px: 4,
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: '#005DA6', boxShadow: 'none' },
                  '&:disabled': { bgcolor: '#CCCCCC', color: '#666666' },
                }}
              >
                Next
              </AnyButton>
            </Box>
          </>
        )}

        {step === 2 && selectedProfile && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <AnyButton
                size="small"
                onClick={() => setStep(1)}
                sx={{
                  minWidth: 0,
                  p: 0,
                  color: '#242424',
                  fontSize: '1.2rem',
                  lineHeight: 1,
                }}
              >
                ←
              </AnyButton>
              <Typography variant="body2" sx={{ color: '#242424', fontWeight: 500 }}>
                {selectedProfile.email}
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2.5, color: '#1B1B1B', fontSize: '1.5rem' }}>
              Enter password
            </Typography>

            <AnyTextField
              type="password"
              fullWidth
              size="small"
              placeholder="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              sx={{
                mb: 3.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': { borderColor: '#8A8A8A' },
                  '&:hover fieldset': { borderColor: '#242424' },
                  '&.Mui-focused fieldset': { borderColor: '#0067B8', borderWidth: 2 },
                },
              }}
            />

            <Typography variant="body2" sx={{ mb: 4, fontSize: '0.85rem' }}>
              <Link href="#" sx={{ color: '#0067B8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Forgot password?
              </Link>
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <AnyButton
                variant="outlined"
                onClick={() => setStep(1)}
                sx={{
                  color: '#242424',
                  borderColor: '#CCCCCC',
                  borderRadius: 0,
                  px: 3,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: '#F2F2F2', borderColor: '#8A8A8A' },
                }}
              >
                Cancel
              </AnyButton>
              <AnyButton
                variant="contained"
                onClick={handleSignIn}
                sx={{
                  bgcolor: '#0067B8',
                  color: '#FFFFFF',
                  borderRadius: 0,
                  px: 3,
                  boxShadow: 'none',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: '#005DA6', boxShadow: 'none' },
                }}
              >
                Sign in
              </AnyButton>
            </Box>
          </>
        )}

        {step === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
            <CircularProgress size={42} sx={{ color: '#0067B8', mb: 3 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: '#242424', mb: 1 }}>
              Taking you to your organization's sign-in page...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Verifying credentials with Microsoft Entra ID
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
