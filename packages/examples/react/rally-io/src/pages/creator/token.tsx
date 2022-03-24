import { useState } from 'react';
import type { NextPage } from 'next'
import {
    Typography,
    Container,
    Box,
    Stepper,
    StepLabel,
    StepContent,
    Step,
    Button,
    Paper
} from '@mui/material';
import { APP_NAME, copy } from '../../config'
import Layout from "../../components/Layout";
import CreateToken from "../../components/CreateToken";
import InitTbc from '../../components/InitTbc';

const steps = [
    {
        label: 'Create Token',
        description: `Create your token`,
        component: CreateToken
    },
    {
        label: 'Initialize Bonding Curve',
        description:
            'Configure your bonding curve',
    },
];



const Token: NextPage = () => {

    const defaultTokenBValues = {
        pubKey: "",
        tokenBName: "token B"
    }

    const [activeStep, setActiveStep] = useState(0);
    const [tokenB, setTokenB] = useState(defaultTokenBValues);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleSteps = (step: number) => {
        switch (step) {
            case 0:
                return <CreateToken updateTokenB={setTokenB} />
            case 1:
                return <InitTbc tokenB={tokenB.pubKey} tokenBName={tokenB.tokenBName} />
            default:
                return "no step"
        }
    }

    return (
        <Layout title={`Create Token | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }} >

                <Box sx={{ maxWidth: 400 }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    optional={
                                        index === 2 ? (
                                            <Typography variant="caption">Last step</Typography>
                                        ) : null
                                    }
                                >
                                    {step.label}
                                </StepLabel>
                                <StepContent>
                                    {handleSteps(index)}
                                    {<Box sx={{ mb: 2 }}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={handleNext}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                            </Button>
                                            <Button
                                                disabled={index === 0}
                                                onClick={handleBack}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Back
                                            </Button>
                                        </div>
                                    </Box>}
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Typography>Your token has been created and our bonding curve has been initialized</Typography>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                Reset
                            </Button>
                        </Paper>
                    )}
                </Box>
            </Container>
        </Layout>
    )

    /*return (
        <Layout title={`Create Token | ${APP_NAME}`}>
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }} >
                <Typography variant="h5" align="center" color="text.secondary" component="h1" sx={{ pt: 2, pb: 2 }}>
                    Launch Token
                </Typography>
                <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 2, pb: 2 }}>
                    <CreateToken />
                </Container >
            </Container>
        </Layout >
    )*/
}

export default Token