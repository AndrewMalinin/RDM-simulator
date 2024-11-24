import React, { useEffect, useRef } from 'react';
import{ Playground } from '../entities/playground';
import {PlaygroundControlForm} from '../widgets/playground-control-form/ui';
import { Box } from '@mui/material';


function App() {


  return (
    <div className="App" style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box display={'flex'} flexDirection={'row'} gap={'32px'} justifyContent={'center'} margin={'auto'}>
      <Playground/>
      <PlaygroundControlForm/>
      </Box>

    </div>
  );
}

export default App;
