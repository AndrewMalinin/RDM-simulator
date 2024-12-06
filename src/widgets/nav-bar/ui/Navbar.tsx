import { FC } from 'react';
import { Box } from '@mui/material';

import { NavTabs } from '../../../features/nav-tabs';

export const NavBar: FC = () => {
    return (
        <Box mr={2.25} ml={2.5} display={'flex'} alignItems={'center'}>
            <NavTabs />
        </Box>
    );
};
