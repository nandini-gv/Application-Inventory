import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircleOutlined as SuccessIcon,
} from '@mui/icons-material';
import confetti from 'canvas-confetti';
import { GlassCard } from '../../../components/GlassCard';
import { ApplicationService } from '../../../shared/services/ApplicationService';
import { MASTER_DATA } from '../../../shared/config/masterData';
import { applicationFormSchema } from '../schemas/applicationFormSchema';
import type { ApplicationFormValues } from '../schemas/applicationFormSchema';

// Import wizard section components
import { GeneralInformationSection } from '../components/GeneralInformationSection';
import { OwnershipSection } from '../components/OwnershipSection';
import { TechnologySection } from '../components/TechnologySection';
import { EnvironmentSection } from '../components/EnvironmentSection';
import { DocumentationSection } from '../components/DocumentationSection';
import { TelemetrySection } from '../components/TelemetrySection';
import { ReviewSection } from '../components/ReviewSection';

export const RegisterApp: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'General Info',
    'Ownership & Support',
    'Technology & Docs',
    'Environments & Telemetry',
    'Review & Submit',
  ];

  // Pre-initialize environment records with their names
  const defaultEnvironments = MASTER_DATA.ENVIRONMENTS.reduce((acc, env) => {
    acc[env] = { envName: env, uiUrl: '', backendUrl: '', databaseUrl: '', serverUrl: '', serverIp: '', repoUrl: '' };
    return acc;
  }, {} as any);

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      appId: '',
      version: '1.0.0',
      status: 'Development',
      hostingType: 'Cloud',
      deploymentMethod: 'Docker',
      dockerDetails: {
        imageName: '',
        registry: 'docker.enterprise.com',
        containerName: '',
        namespace: 'default',
      },
      owner: {
        businessUnits: [],
        businessOwner: '',
        technicalOwner: '',
        supportTeam: '',
        supportEmail: '',
        supportContact: '',
      },
      technology: {
        frontend: [],
        backend: [],
        middleware: [],
        authentication: [],
        messaging: [],
        cache: [],
        monitoring: [],
        other: [],
      },
      environments: defaultEnvironments,
      telemetry: {
        telemetryEnabled: false,
        opensearchDashboard: '',
        serviceName: '',
        opensearchIndex: '',
        environment: 'PROD',
        healthEndpoint: '',
        availability: 99.9,
        responseTime: 100,
      },
      documents: {
        repositoryUrl: '',
        confluenceUrl: '',
        teamsChannelUrl: '',
        swaggerUrl: '',
        architectureDiagramUrl: '',
        runbookUrl: '',
        jenkinsUrl: '',
        sonarQubeUrl: '',
        nexusUrl: '',
      },
    },
    mode: 'onChange',
  });

  const { trigger, getValues, watch } = methods;

  // Watch deploymentMethod to conditionally trigger validation schemas
  const deploymentMethod = watch('deploymentMethod');

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 50,
        origin: { x: 0 },
        colors: ['#7C3AED', '#06B6D4', '#22D3EE'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 50,
        origin: { x: 1 },
        colors: ['#7C3AED', '#06B6D4', '#22D3EE'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNext = async () => {
    // Validate step fields dynamically
    let fieldsToValidate: any[] = [];
    if (activeStep === 0) {
      fieldsToValidate = ['name', 'appId', 'description', 'version', 'status'];
    } else if (activeStep === 1) {
      fieldsToValidate = [
        'owner.businessUnits',
        'owner.businessOwner',
        'owner.technicalOwner',
        'owner.supportTeam',
        'owner.supportEmail',
        'owner.supportContact',
      ];
    } else if (activeStep === 2) {
      fieldsToValidate = [
        'hostingType',
        'deploymentMethod',
        'documents.repositoryUrl',
        'documents.confluenceUrl',
      ];
      if (deploymentMethod === 'Docker') {
        fieldsToValidate.push(
          'dockerDetails.imageName',
          'dockerDetails.registry',
          'dockerDetails.containerName',
          'dockerDetails.namespace'
        );
      }
    } else if (activeStep === 3) {
      fieldsToValidate = [
        'telemetry.opensearchDashboard',
        'telemetry.healthEndpoint',
      ];
      MASTER_DATA.ENVIRONMENTS.forEach((env) => {
        fieldsToValidate.push(
          `environments.${env}.uiUrl`,
          `environments.${env}.backendUrl`,
          `environments.${env}.repoUrl`,
          `environments.${env}.opensearchDashboard`,
          `environments.${env}.healthEndpoint`
        );
      });
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (activeStep === steps.length - 1) {
        handleSubmitForm();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmitForm = async () => {
    const rawValues = getValues();
    
    // Clean up DockerDetails if deploymentMethod is not Docker
    const payload = {
      ...rawValues,
      dockerDetails: rawValues.deploymentMethod === 'Docker' ? rawValues.dockerDetails : undefined,
    };

    try {
      await ApplicationService.createApplication(payload);
      setActiveStep(steps.length);
      triggerConfetti();
    } catch (err) {
      console.error('Failed to submit application registry:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 900, mx: 'auto', width: '100%' }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: '#FFFFFF', mb: 1 }}>
          Register Application
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Publish a new application specifications record to the centralized tracking portal catalog.
        </Typography>
      </Box>

      <GlassCard sx={{ p: 4 }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 5,
            '& .MuiStepLabel-label': {
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.8rem',
              '&.Mui-active': { color: 'primary.light', fontWeight: 600 },
              '&.Mui-completed': { color: 'text.primary' },
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '50%',
              '&.Mui-active': { color: 'primary.main', border: 'none' },
              '&.Mui-completed': { color: 'secondary.main', border: 'none' },
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <FormProvider {...methods}>
          {activeStep === steps.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2.5 }}>
              <SuccessIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                Application Registered
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 500, lineHeight: 1.6 }}>
                The application specifications have been successfully compiled and recorded. Swapping mock sync engines for SharePoint lists later will require zero views modification.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/applications')}>
                  Go to Inventory
                </Button>
                <Button variant="contained" onClick={() => window.location.reload()}>
                  Register Another App
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {activeStep === 0 && <GeneralInformationSection />}
              {activeStep === 1 && <OwnershipSection />}
              
              {activeStep === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <TechnologySection />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 2 }}>
                      System Documents Links
                    </Typography>
                    <DocumentationSection />
                  </Box>
                </Box>
              )}

              {activeStep === 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <EnvironmentSection />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 2.5 }}>
                      Global Telemetry Sync
                    </Typography>
                    <TelemetrySection />
                  </Box>
                </Box>
              )}

              {activeStep === 4 && <ReviewSection />}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<PrevIcon />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={activeStep === steps.length - 1 ? undefined : <NextIcon />}
                >
                  {activeStep === steps.length - 1 ? 'Publish Registry' : 'Continue'}
                </Button>
              </Box>
            </Box>
          )}
        </FormProvider>
      </GlassCard>
    </Box>
  );
};
