'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Radar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
)

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

// Helper functions for generating random data
const generateRandomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const generateRandomToxicity = () => {
  const scores = [15, 20, 25, 30, 35]
  return scores[Math.floor(Math.random() * scores.length)]
}
const generateRandomBBB = () => {
  const scores = [65, 70, 75, 80, 85, 90]
  return scores[Math.floor(Math.random() * scores.length)]
}
const generateRandomBioavailability = () => {
  const scores = [70, 75, 80, 85, 90, 95]
  return scores[Math.floor(Math.random() * scores.length)]
}
const generateRandomSolubility = () => {
  const scores = [60, 65, 70, 75, 80, 85]
  return scores[Math.floor(Math.random() * scores.length)]
}
const generateRandomStability = () => {
  const scores = [70, 75, 80, 85, 90]
  return scores[Math.floor(Math.random() * scores.length)]
}

const generateSMILES = () => {
  const coreFragments = [
    // Aromatic rings
    'c1ccccc1', 'c1ccncc1', 'c1cccnc1', 'c1ccncc1', 'c1ccsc1', 'c1ccoc1',
    'c1ccncc1', 'c1cccnc1', 'c1ccncc1', 'c1ccsc1', 'c1ccoc1',
    // Heterocycles
    'C1CCCCC1', 'C1CCNCC1', 'C1CCNCC1', 'C1CCNCC1', 'C1CCSCC1', 'C1CCOCC1',
    'C1CCNCC1', 'C1CCNCC1', 'C1CCNCC1', 'C1CCSCC1', 'C1CCOCC1',
    // Common drug scaffolds
    'CC(=O)NC', 'CC(=O)NN', 'CC(=O)OC', 'CC(=O)SC', 'CC(=O)NC',
    'CN1CCCC1', 'CN1CCCC1', 'CN1CCCC1', 'CN1CCCC1', 'CN1CCCC1',
  ]

  const substituents = [
    // Alkyl groups
    'C', 'CC', 'CCC', 'CCCC', 'CCCCC',
    // Halogens
    'F', 'Cl', 'Br', 'I',
    // Functional groups
    'OC', 'SC', 'NC', 'CC(=O)', 'CC(=O)O',
    'CC(=O)N', 'CC(=O)S', 'CC(=O)OC', 'CC(=O)NC',
    // Polar groups
    'OC', 'SC', 'NC', 'CC(=O)', 'CC(=O)O',
    'CC(=O)N', 'CC(=O)S', 'CC(=O)OC', 'CC(=O)NC',
    // Aromatic substituents
    'c1ccccc1', 'c1ccncc1', 'c1cccnc1', 'c1ccncc1',
  ]

  const linkers = [
    // Single bonds
    '', 'C', 'CC', 'CCC',
    // Double bonds
    '=C', '=CC', '=CCC',
    // Triple bonds
    '#C', '#CC',
    // Heteroatom linkers
    'O', 'S', 'N', 'NC', 'CO', 'CS',
    // Aromatic linkers
    'c1ccccc1', 'c1ccncc1',
  ]

  // Generate a random number of core fragments (1-3)
  const numCores = Math.floor(Math.random() * 3) + 1
  let smiles = ''

  for (let i = 0; i < numCores; i++) {
    // Add a core fragment
    smiles += coreFragments[Math.floor(Math.random() * coreFragments.length)]
    
    // Add 0-2 substituents to the core
    const numSubstituents = Math.floor(Math.random() * 3)
    for (let j = 0; j < numSubstituents; j++) {
      smiles += substituents[Math.floor(Math.random() * substituents.length)]
    }

    // Add a linker if not the last core
    if (i < numCores - 1) {
      smiles += linkers[Math.floor(Math.random() * linkers.length)]
    }
  }

  // Add final substituents
  const numFinalSubstituents = Math.floor(Math.random() * 2)
  for (let i = 0; i < numFinalSubstituents; i++) {
    smiles += substituents[Math.floor(Math.random() * substituents.length)]
  }

  return smiles
}

const generateKeyNotes = (properties: any) => {
  const notes = []
  
  if (properties.toxicity <= 20) {
    notes.push('Very low predicted toxicity')
  } else if (properties.toxicity <= 30) {
    notes.push('Low predicted toxicity')
  }

  if (properties.bbbPenetration >= 85) {
    notes.push('Excellent blood-brain barrier crossing')
  } else if (properties.bbbPenetration >= 75) {
    notes.push('Strong blood-brain barrier crossing')
  } else if (properties.bbbPenetration >= 65) {
    notes.push('Moderate blood-brain barrier crossing')
  }

  if (properties.oralBioavailability >= 90) {
    notes.push('High oral bioavailability')
  } else if (properties.oralBioavailability >= 80) {
    notes.push('Moderate oral bioavailability')
  }

  if (properties.solubility >= 80) {
    notes.push('Excellent aqueous solubility')
  } else if (properties.solubility >= 70) {
    notes.push('Good aqueous solubility')
  }

  if (properties.metabolicStability >= 85) {
    notes.push('High metabolic stability')
  } else if (properties.metabolicStability >= 75) {
    notes.push('Moderate metabolic stability')
  }

  // Add some random structural notes
  const structuralNotes = [
    'Structurally novel compared to existing drugs',
    'Favorable molecular weight and lipophilicity',
    'Good balance of polar and non-polar groups',
    'Predicted to be easily synthesizable',
    'Favorable 3D conformation for target binding',
    'Low predicted clearance rate',
    'Good predicted protein binding',
    'Favorable predicted half-life',
  ]
  
  const numStructuralNotes = Math.floor(Math.random() * 2) + 1
  for (let i = 0; i < numStructuralNotes; i++) {
    const randomNote = structuralNotes[Math.floor(Math.random() * structuralNotes.length)]
    if (!notes.includes(randomNote)) {
      notes.push(randomNote)
    }
  }

  return notes
}

const getDiseaseSpecificProperties = (diseaseName: string) => {
  const diseasePatterns: { [key: string]: any } = {
    'alzheimers': {
      bbbPenetration: { min: 80, max: 95 },
      toxicity: { min: 10, max: 25 },
      metabolicStability: { min: 80, max: 95 },
      solubility: { min: 70, max: 85 },
      oralBioavailability: { min: 75, max: 90 }
    },
    'parkinsons': {
      bbbPenetration: { min: 85, max: 95 },
      toxicity: { min: 15, max: 30 },
      metabolicStability: { min: 75, max: 90 },
      solubility: { min: 65, max: 80 },
      oralBioavailability: { min: 70, max: 85 }
    },
    'cancer': {
      bbbPenetration: { min: 60, max: 85 },
      toxicity: { min: 30, max: 45 },
      metabolicStability: { min: 70, max: 85 },
      solubility: { min: 75, max: 90 },
      oralBioavailability: { min: 65, max: 80 }
    },
    'diabetes': {
      bbbPenetration: { min: 50, max: 70 },
      toxicity: { min: 10, max: 25 },
      metabolicStability: { min: 80, max: 95 },
      solubility: { min: 80, max: 95 },
      oralBioavailability: { min: 85, max: 95 }
    },
    'hypertension': {
      bbbPenetration: { min: 55, max: 75 },
      toxicity: { min: 10, max: 25 },
      metabolicStability: { min: 75, max: 90 },
      solubility: { min: 75, max: 90 },
      oralBioavailability: { min: 80, max: 95 }
    }
  }

  return diseasePatterns[diseaseName.toLowerCase()] || {
    bbbPenetration: { min: 65, max: 90 },
    toxicity: { min: 15, max: 35 },
    metabolicStability: { min: 70, max: 90 },
    solubility: { min: 60, max: 85 },
    oralBioavailability: { min: 70, max: 90 }
  }
}

const generateRandomProperty = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Add property correlations
const applyPropertyCorrelations = (properties: any) => {
  // High BBB penetration often correlates with good metabolic stability
  if (properties.bbbPenetration > 85) {
    properties.metabolicStability = Math.min(95, properties.metabolicStability + 5)
  }

  // High toxicity often correlates with poor metabolic stability
  if (properties.toxicity > 30) {
    properties.metabolicStability = Math.max(60, properties.metabolicStability - 5)
  }

  // High solubility often correlates with good oral bioavailability
  if (properties.solubility > 80) {
    properties.oralBioavailability = Math.min(95, properties.oralBioavailability + 5)
  }

  // Low toxicity often correlates with good metabolic stability
  if (properties.toxicity < 20) {
    properties.metabolicStability = Math.min(95, properties.metabolicStability + 5)
  }

  return properties
}

const generateCandidates = (count: number, diseaseName: string) => {
  const candidates = []
  const diseasePrefixes = {
    'alzheimers': 'ALZ',
    'parkinsons': 'PKD',
    'cancer': 'CNC',
    'diabetes': 'DIA',
    'hypertension': 'HYP',
    'arthritis': 'ART',
    'asthma': 'AST',
    'depression': 'DEP',
    'epilepsy': 'EPL',
    'migraine': 'MIG',
  }

  const diseasePatterns = getDiseaseSpecificProperties(diseaseName)

  for (let i = 0; i < count; i++) {
    let properties = {
      toxicity: generateRandomProperty(diseasePatterns.toxicity.min, diseasePatterns.toxicity.max),
      bbbPenetration: generateRandomProperty(diseasePatterns.bbbPenetration.min, diseasePatterns.bbbPenetration.max),
      oralBioavailability: generateRandomProperty(diseasePatterns.oralBioavailability.min, diseasePatterns.oralBioavailability.max),
      solubility: generateRandomProperty(diseasePatterns.solubility.min, diseasePatterns.solubility.max),
      metabolicStability: generateRandomProperty(diseasePatterns.metabolicStability.min, diseasePatterns.metabolicStability.max),
    }

    // Apply property correlations
    properties = applyPropertyCorrelations(properties)

    const drugLikenessScore = Math.floor(
      (100 - properties.toxicity + 
       properties.bbbPenetration + 
       properties.oralBioavailability + 
       properties.solubility + 
       properties.metabolicStability) / 5
    )

    const prefix = diseasePrefixes[diseaseName.toLowerCase()] || 'DRG'
    const id = `${prefix}-C${String(i + 1).padStart(3, '0')}`

    candidates.push({
      id,
      drugLikenessScore,
      toxicity: properties.toxicity <= 20 ? 'Very Low' : 'Low',
      bbbPenetration: properties.bbbPenetration >= 85 ? 'High' : properties.bbbPenetration >= 75 ? 'Moderate' : 'Low',
      oralBioavailability: properties.oralBioavailability >= 90 ? 'High' : 'Moderate',
      syntheticFeasibility: Math.random() > 0.3 ? 'Easy to synthesize' : 'Moderate synthesis',
      smiles: generateSMILES(),
      keyNotes: generateKeyNotes(properties),
      properties,
    })
  }

  return candidates.sort((a, b) => b.drugLikenessScore - a.drugLikenessScore)
}

// Mock data for demonstration
const mockResults = {
  disease: "Alzheimer's Disease",
  target: "Beta-secretase 1 (BACE1) inhibition",
  administrationRoute: "Oral tablet",
  desiredProperties: [
    "High blood-brain barrier permeability",
    "Low toxicity",
    "High oral bioavailability"
  ],
  totalMolecules: 1000,
  topCandidates: 50,
  candidates: generateCandidates(50, "Alzheimer's Disease"),
  systemMetrics: {
    totalMoleculesScreened: 1000,
    passedDrugLikeness: Math.floor(Math.random() * 200) + 300,
    filteredByToxicity: Math.floor(Math.random() * 100) + 200,
    filteredByBBB: Math.floor(Math.random() * 50) + 100,
    topCandidatesSelected: 50
  }
}

export default function Results() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'analysis'>('overview')
  const router = useRouter()

  useEffect(() => {
    // Get form data from localStorage
    const storedData = localStorage.getItem('drugDiscoveryFormData')
    if (!storedData) {
      // If no form data is found, redirect back to home
      router.push('/')
      return
    }
    setFormData(JSON.parse(storedData))
  }, [router])

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Chart data for system metrics
  const systemMetricsData = {
    labels: ['Total Screened', 'Drug-Likeness', 'Toxicity', 'BBB'],
    datasets: [
      {
        label: 'Molecules',
        data: [
          mockResults.systemMetrics.totalMoleculesScreened,
          mockResults.systemMetrics.passedDrugLikeness,
          mockResults.systemMetrics.filteredByToxicity,
          mockResults.systemMetrics.filteredByBBB,
        ],
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1,
      },
    ],
  }

  // Chart data for candidate comparison
  const candidateComparisonData = {
    labels: mockResults.candidates.map(c => c.id),
    datasets: [
      {
        label: 'Drug-Likeness Score',
        data: mockResults.candidates.map(c => c.drugLikenessScore),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
      },
    ],
  }

  // Radar chart data for selected candidate
  const getRadarData = (candidateId: string) => {
    const candidate = mockResults.candidates.find(c => c.id === candidateId)
    if (!candidate) return null

    return {
      labels: ['Toxicity', 'BBB Penetration', 'Oral Bioavailability', 'Solubility', 'Metabolic Stability'],
      datasets: [
        {
          label: candidate.id,
          data: [
            candidate.properties.toxicity,
            candidate.properties.bbbPenetration,
            candidate.properties.oralBioavailability,
            candidate.properties.solubility,
            candidate.properties.metabolicStability,
          ],
          backgroundColor: 'rgba(14, 165, 233, 0.2)',
          borderColor: 'rgb(14, 165, 233)',
          borderWidth: 2,
        },
      ],
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Summary Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Drug Discovery Results
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Information</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Disease:</dt>
                  <dd className="font-medium">{formData.diseaseName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Target:</dt>
                  <dd className="font-medium">{mockResults.target}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Administration:</dt>
                  <dd className="font-medium">
                    {administrationRoutes.find(r => r.value === formData.administrationRoute)?.label || formData.administrationRoute}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Desired Properties</h2>
              <ul className="space-y-2">
                {formData.drugProperties.map((prop: string) => {
                  const property = drugProperties.find(p => p.value === prop)
                  return property ? (
                    <li key={prop} className="flex items-center text-gray-700">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {property.label}
                    </li>
                  ) : null
                })}
              </ul>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'details', 'analysis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Metrics</h3>
                  <div className="h-80">
                    <Bar
                      data={systemMetricsData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Comparison</h3>
                  <div className="h-80">
                    <Line
                      data={candidateComparisonData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Candidate List */}
                <div className="lg:col-span-2 space-y-4">
                  {mockResults.candidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="card cursor-pointer hover:border-primary-500 transition-colors"
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{candidate.id}</h3>
                          <p className="text-sm text-gray-500">Score: {candidate.drugLikenessScore}%</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {candidate.toxicity}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {candidate.bbbPenetration}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {candidate.oralBioavailability}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Detailed View */}
                <div className="lg:col-span-1">
                  {selectedCandidate ? (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="card sticky top-8"
                    >
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        {selectedCandidate}
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Molecular Structure</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="text-sm font-mono">
                              {mockResults.candidates.find(c => c.id === selectedCandidate)?.smiles}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Key Notes</h3>
                          <ul className="space-y-2">
                            {mockResults.candidates.find(c => c.id === selectedCandidate)?.keyNotes.map((note, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-primary-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="card text-center py-12">
                      <p className="text-gray-500">Select a candidate to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && selectedCandidate && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Analysis</h3>
                  <div className="h-96">
                    <Radar
                      data={getRadarData(selectedCandidate)!}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                  <dl className="space-y-4">
                    {Object.entries(mockResults.candidates.find(c => c.id === selectedCandidate)?.properties || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <dt className="w-1/3 text-sm font-medium text-gray-500">{key}</dt>
                        <dd className="w-2/3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary-600 h-2.5 rounded-full"
                              style={{ width: `${value as number}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 ml-2">{value as number}%</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Note: These are AI-generated molecules and require experimental validation.
            Please consult with your research team before proceeding with any compounds.
          </p>
          <button className="btn-primary mt-6">
            Download Full Report
          </button>
        </div>
      </motion.div>
    </div>
  )
} 