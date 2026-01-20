import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export const CreateContract: React.FC = () => {
  const navigate = useNavigate()

  const [contractName, setContractName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contractName.trim()) {
      alert('Contract name is required')
      return
    }

    setSubmitting(true)
    try {
      // API / storage logic will go here later
      alert('Contract created successfully!')
      navigate('/')
    } catch (error) {
      console.error(error)
      alert('Failed to create contract')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ padding: 0 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Button onClick={() => navigate('/')} style={{ marginRight: 16 }}>
          ← Back
        </Button>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
          Create New Contract
        </h1>
      </header>

      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Contract Name"
            required
            value={contractName}
            onChange={e => setContractName(e.target.value)}
            placeholder="e.g., NDA for John Doe"
          />

          <div
            style={{
              marginTop: 30,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button type="submit" isLoading={submitting}>
              Create Contract
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
