import React from 'react';
import { Box } from '@mui/material';
import { Spectrum } from '../../../entities/spectrum/ui';


export function SpectrumPage() {
    return (
        <Box display={'flex'} flexDirection={'row'} gap={'32px'} justifyContent={'center'} margin={'auto'}>
            <Spectrum />
        </Box>
    );
}
