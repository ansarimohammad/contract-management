import React from 'react'
import { Button } from '../components/ui/Button'
import {useNavigate} from 'react-router-dom'

export const CreateContract: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Button onClick={() => navigate('/')} style={{ marginRight: '16px' }}>← Back</Button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Create New Contract</h1>
      </header>
    </div>
  )
}


