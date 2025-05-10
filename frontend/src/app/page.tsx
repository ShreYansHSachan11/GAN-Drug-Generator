'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type FormData = {
  diseaseName: string
  drugProperties: string[]
  administrationRoute: string
  batchSize: string
}

const drugProperties = [
  { label: 'Low Toxicity', value: 'low_toxicity' },
  { label: 'High Oral Bioavailability', value: 'high_bioavailability' },
  { label: 'Blood-Brain Barrier Crossing', value: 'bbb_crossing' },
  { label: 'Good Solubility', value: 'good_solubility' },
  { label: 'Metabolic Stability', value: 'metabolic_stability' },
]

const administrationRoutes = [
  { label: 'Oral', value: 'oral' },
  { label: 'Intravenous', value: 'iv' },
  { label: 'Inhaled', value: 'inhaled' },
  { label: 'Transdermal Patch', value: 'patch' },
]

const batchSizes = [
  { label: 'Small (5 molecules)', value: 'small' },
  { label: 'Medium (10 molecules)', value: 'medium' },
  { label: 'Large (20 molecules)', value: 'large' },
]

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true)
    try {
      // Call our drug classification endpoint
      const response = await axios.get('/api/druggen/v1/generate')
      
      // Store both form data and drug classification data in localStorage
      localStorage.setItem('drugDiscoveryFormData', JSON.stringify({
        ...data,
        drugClassification: response.data
      }))
      
      // Show success message
      toast.success('Drug candidates generated successfully!')
      
      // Redirect to results page
      router.push('/results')
    } catch (error) {
      toast.error('An error occurred while generating candidates')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Drug Discovery Platform
          </h1>
          <p className="text-lg text-gray-600">
            Generate novel drug candidates for your target disease using advanced machine learning
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Disease</h2>
            <input
              type="text"
              {...register('diseaseName', { required: 'Disease name is required' })}
              placeholder="e.g., Alzheimer's, Cancer, COVID-19"
              className="input-field"
            />
            {errors.diseaseName && (
              <p className="mt-1 text-sm text-red-600">{errors.diseaseName.message}</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Desired Drug Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {drugProperties.map((property) => (
                <label key={property.value} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('drugProperties')}
                    value={property.value}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{property.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Administration Route</h2>
            <select
              {...register('administrationRoute', { required: 'Please select an administration route' })}
              className="input-field"
            >
              <option value="">Select a route...</option>
              {administrationRoutes.map((route) => (
                <option key={route.value} value={route.value}>
                  {route.label}
                </option>
              ))}
            </select>
            {errors.administrationRoute && (
              <p className="mt-1 text-sm text-red-600">{errors.administrationRoute.message}</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Size</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {batchSizes.map((size) => (
                <label 
                  key={size.value} 
                  className="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none hover:border-primary-500 transition-colors"
                >
                  <input
                    type="radio"
                    {...register('batchSize', { required: 'Please select a batch size' })}
                    value={size.value}
                    className="sr-only peer"
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 peer-checked:text-primary-600">
                        {size.label}
                      </span>
                    </span>
                  </span>
                  <span className="absolute inset-0 border-2 border-transparent peer-checked:border-primary-500 rounded-lg pointer-events-none"></span>
                </label>
              ))}
            </div>
            {errors.batchSize && (
              <p className="mt-1 text-sm text-red-600">{errors.batchSize.message}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary min-w-[200px]"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Drug Candidates'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 