import { FC, ReactNode } from 'react';
import { Box } from '@mui/material';

import './main.css';

interface IMainLayoutProps {
    content: ReactNode;
    header: ReactNode;
}
const MainLayout: FC<IMainLayoutProps> = ({ content, header }) => {
    return (
        <Box className="layout layout__container">
            <Box className="layout__header">{header}</Box>
            <Box className="layout__content">{content}</Box>
        </Box>
    );
};

export default MainLayout;
