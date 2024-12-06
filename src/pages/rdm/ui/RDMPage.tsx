import React from 'react';
import { Box } from '@mui/material';
import { Playground } from '../../../entities/playground';
import { PlaygroundControlForm } from '../../../widgets/playground-control-form';
export function RDMPage() {
    return (
        <Box display={'flex'} flexDirection={'row'} gap={'32px'} justifyContent={'center'} margin={'auto'}>
            <Playground />
            <PlaygroundControlForm />
        </Box>
    );
}
