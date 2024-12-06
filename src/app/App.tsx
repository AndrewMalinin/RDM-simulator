import React from 'react';
import { MainLayout } from './layouts';
import { AppRouter } from './providers';
import { NavBar } from '../widgets/nav-bar';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import theme from '../shared/theme';

function App() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme({})}>
                <CssBaseline />
                <div
                    className="App"
                    style={{
                        height: '100vh',
                        width: '100vw',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <MainLayout header={<NavBar />} content={<AppRouter />} />
                </div>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
