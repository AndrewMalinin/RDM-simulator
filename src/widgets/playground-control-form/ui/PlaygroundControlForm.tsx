import { Box, Button, FormControl } from '@mui/material'
import React, {type FC} from 'react'

type PlaygrounControlFormProps = {}

export const PlaygroundControlForm:FC<PlaygrounControlFormProps> = (props) => {
  return (
    <FormControl>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: "16px"
      }}>
      <Button variant='contained' color='primary'>Добавить Источник</Button>
      <Button  variant='contained' color='primary'>Добавить Приёмник</Button>
      </Box>

    </FormControl>
  )
}
