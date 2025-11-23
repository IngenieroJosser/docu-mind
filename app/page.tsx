'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Download, 
  X, 
  Check, 
  AlertCircle,
  Sparkles,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Search,
  Filter,
  Globe,
  Play,
  BookOpen,
  Menu,
  Home
} from 'lucide-react'
import Image from 'next/image'

type Document = {
  id: string
  name: string
  type: 'scientific' | 'general'
  status: 'uploading' | 'processing' | 'completed' | 'error'
  summary?: string
  uploadTime: Date
  size?: string
  progress?: number
}

type AnalysisResult = {
  documents: Document[]
  consolidatedPdf?: string
}

type Language = 'en' | 'es'

const translations = {
  en: {
    title: "Document Intelligence",
    subtitle: "Reimagined",
    description: "Upload multiple documents and get AI-powered summaries, intelligent classification, and consolidated insights in one beautiful interface.",
    stats: ["Formats", "Pages", "Accuracy"],
    upload: {
      title: "Upload Documents",
      subtitle: "Supported formats: PDF, DOC, XLS, TXT, CSV",
      dropFiles: "Drop your files here",
      orClick: "or click to browse",
      maxFiles: "Maximum 10 files • 100MB each"
    },
    actions: {
      startAnalysis: "Start Analysis",
      search: "Search",
      filter: "Filter",
      download: "Download PDF"
    },
    tabs: {
      documents: "Documents",
      analysis: "Analysis"
    },
    status: {
      uploading: "uploading",
      processing: "processing",
      completed: "completed",
      error: "error"
    },
    analysis: {
      complete: "Analysis Complete",
      description: "All documents processed successfully with AI-powered insights",
      consolidated: "Consolidated Report",
      consolidatedDesc: "Complete analysis summary in PDF format",
      summaries: "Document Summaries"
    },
    features: {
      multiFormat: "Multi-Format Support",
      multiFormatDesc: "PDF, Word, Excel, TXT, CSV with intelligent parsing",
      aiAnalysis: "AI-Powered Analysis",
      aiAnalysisDesc: "Advanced machine learning for accurate insights",
      reports: "Consolidated Reports",
      reportsDesc: "Professional PDF exports with all findings"
    },
    empty: {
      noDocuments: "No documents uploaded",
      uploadFirst: "Upload your first document to get started",
      noResults: "No Analysis Results",
      analyzing: "Analyzing Documents...",
      aiProcessing: "Our AI is processing your documents"
    }
  },
  es: {
    title: "Inteligencia de Documentos",
    subtitle: "Reimaginada",
    description: "Sube múltiples documentos y obtén resúmenes con IA, clasificación inteligente y análisis consolidados en una interfaz hermosa.",
    stats: ["Formatos", "Páginas", "Precisión"],
    upload: {
      title: "Subir Documentos",
      subtitle: "Formatos soportados: PDF, DOC, XLS, TXT, CSV",
      dropFiles: "Suelta tus archivos aquí",
      orClick: "o haz clic para explorar",
      maxFiles: "Máximo 10 archivos • 100MB cada uno"
    },
    actions: {
      startAnalysis: "Iniciar Análisis",
      search: "Buscar",
      filter: "Filtrar",
      download: "Descargar PDF"
    },
    tabs: {
      documents: "Documentos",
      analysis: "Análisis"
    },
    status: {
      uploading: "subiendo",
      processing: "procesando",
      completed: "completado",
      error: "error"
    },
    analysis: {
      complete: "Análisis Completado",
      description: "Todos los documentos procesados exitosamente con análisis de IA",
      consolidated: "Reporte Consolidado",
      consolidatedDesc: "Resumen completo del análisis en formato PDF",
      summaries: "Resúmenes de Documentos"
    },
    features: {
      multiFormat: "Soporte Multi-Formato",
      multiFormatDesc: "PDF, Word, Excel, TXT, CSV con análisis inteligente",
      aiAnalysis: "Análisis con IA",
      aiAnalysisDesc: "Aprendizaje automático avanzado para insights precisos",
      reports: "Reportes Consolidados",
      reportsDesc: "Exportación profesional en PDF con todos los hallazgos"
    },
    empty: {
      noDocuments: "No hay documentos subidos",
      uploadFirst: "Sube tu primer documento para comenzar",
      noResults: "Sin Resultados de Análisis",
      analyzing: "Analizando Documentos...",
      aiProcessing: "Nuestra IA está procesando tus documentos"
    }
  }
}

export default function DocumentAnalyzer() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis'>('upload')
  const [language, setLanguage] = useState<Language>('en')
  const [showFeaturesModal, setShowFeaturesModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = translations[language]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const newDocuments: Document[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.name.toLowerCase().includes('research') || file.name.toLowerCase().includes('study') ? 'scientific' : 'general',
      status: 'uploading',
      uploadTime: new Date(),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      progress: 0
    }))

    setDocuments(prev => [...prev, ...newDocuments])

    // Simular progreso de upload con animación
    newDocuments.forEach((doc, index) => {
      const interval = setInterval(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? { 
                ...d, 
                progress: d.progress! + 10,
                status: d.progress! >= 90 ? 'processing' : 'uploading'
              }
            : d
        ))
        
        if (documents.find(d => d.id === doc.id)?.progress! >= 90) {
          clearInterval(interval)
          setTimeout(() => {
            setDocuments(prev => prev.map(d => 
              d.id === doc.id ? { ...d, status: 'completed' } : d
            ))
          }, 500)
        }
      }, 100 + index * 50)
    })
  }

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const analyzeDocuments = async () => {
    setIsAnalyzing(true)
    setActiveTab('analysis')
    
    setTimeout(() => {
      const processedDocs = documents.map(doc => ({
        ...doc,
        status: 'completed' as const,
        summary: language === 'en' 
          ? `AI-generated summary for ${doc.name}. This ${doc.type} document has been processed using advanced AI algorithms, extracting key insights and relevant patterns.`
          : `Resumen generado por IA para ${doc.name}. Este documento ${doc.type === 'scientific' ? 'científico' : 'general'} ha sido procesado mediante algoritmos de IA avanzada, extrayendo insights clave y patrones relevantes.`
      }))

      setAnalysisResult({
        documents: processedDocs,
        consolidatedPdf: 'documento-consolidado.pdf'
      })
      setIsAnalyzing(false)
    }, 4000)
  }

  const downloadConsolidatedPdf = () => {
    const link = document.createElement('a')
    link.href = '#'
    link.download = 'documento-consolidado.pdf'
    link.click()
  }

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-400" />
      case 'processing':
        return <Zap className="w-4 h-4 text-purple-500 animate-pulse" />
      case 'completed':
        return <Check className="w-4 h-4 text-emerald-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500" />
    }
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'uploading':
        return 'border-blue-200 bg-blue-50'
      case 'processing':
        return 'border-purple-200 bg-purple-50'
      case 'completed':
        return 'border-emerald-200 bg-emerald-50'
      case 'error':
        return 'border-rose-200 bg-rose-50'
    }
  }

  const FeaturesModal = () => (
    <AnimatePresence>
      {showFeaturesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFeaturesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              <div className="relative p-6 sm:p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-light">
                    {language === 'en' ? 'Features & Documentation' : 'Características y Documentación'}
                  </h2>
                  <button
                    onClick={() => setShowFeaturesModal(false)}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <p className="text-blue-100 text-sm sm:text-lg max-w-2xl">
                  {language === 'en' 
                    ? 'Discover all the powerful features and comprehensive documentation for our AI document analyzer.'
                    : 'Descubre todas las características poderosas y la documentación completa de nuestro analizador de documentos con IA.'}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-8 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Features Section */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-light text-slate-800 mb-6 flex items-center gap-3">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                    {language === 'en' ? 'Key Features' : 'Características Principales'}
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      {
                        icon: FileText,
                        title: t.features.multiFormat,
                        description: t.features.multiFormatDesc,
                        details: language === 'en' 
                          ? ['PDF text extraction', 'Word document parsing', 'Excel data analysis', 'CSV file processing', 'TXT file support']
                          : ['Extracción de texto PDF', 'Análisis de documentos Word', 'Análisis de datos Excel', 'Procesamiento de archivos CSV', 'Soporte para archivos TXT']
                      },
                      {
                        icon: BarChart3,
                        title: t.features.aiAnalysis,
                        description: t.features.aiAnalysisDesc,
                        details: language === 'en'
                          ? ['Machine learning models', 'Natural language processing', 'Pattern recognition', 'Semantic analysis', 'Automated classification']
                          : ['Modelos de aprendizaje automático', 'Procesamiento de lenguaje natural', 'Reconocimiento de patrones', 'Análisis semántico', 'Clasificación automatizada']
                      },
                      {
                        icon: Download,
                        title: t.features.reports,
                        description: t.features.reportsDesc,
                        details: language === 'en'
                          ? ['Professional formatting', 'Multi-document synthesis', 'Key insights highlighting', 'Executive summaries', 'Export in multiple formats']
                          : ['Formato profesional', 'Síntesis multi-documento', 'Destacado de insights clave', 'Resúmenes ejecutivos', 'Exportación en múltiples formatos']
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                            <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 mb-2 text-sm sm:text-base">{feature.title}</h4>
                            <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4">{feature.description}</p>
                            <ul className="space-y-1 sm:space-y-2">
                              {feature.details.map((detail, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                  <span className="break-words">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Documentation Section */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-light text-slate-800 mb-6 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    {language === 'en' ? 'Documentation' : 'Documentación'}
                  </h3>

                  <div className="space-y-4 sm:space-y-6">
                    {[
                      {
                        title: language === 'en' ? 'Getting Started' : 'Comenzando',
                        description: language === 'en' 
                          ? 'Learn how to upload and analyze your first documents'
                          : 'Aprende a subir y analizar tus primeros documentos',
                        steps: language === 'en'
                          ? ['Drag and drop files', 'Click start analysis', 'View AI insights', 'Download consolidated report']
                          : ['Arrastra y suelta archivos', 'Haz clic en iniciar análisis', 'Visualiza insights de IA', 'Descarga el reporte consolidado']
                      },
                      {
                        title: language === 'en' ? 'Best Practices' : 'Mejores Prácticas',
                        description: language === 'en'
                          ? 'Optimize your document analysis with these tips'
                          : 'Optimiza tu análisis de documentos con estos consejos',
                        steps: language === 'en'
                          ? ['Use clear file names', 'Group related documents', 'Check file formats', 'Review AI summaries']
                          : ['Usa nombres de archivo claros', 'Agrupa documentos relacionados', 'Verifica formatos de archivo', 'Revisa los resúmenes de IA']
                      },
                      {
                        title: language === 'en' ? 'API Integration' : 'Integración API',
                        description: language === 'en'
                          ? 'Connect our AI analyzer to your applications'
                          : 'Conecta nuestro analizador de IA a tus aplicaciones',
                        steps: language === 'en'
                          ? ['RESTful API endpoints', 'JSON responses', 'Webhook support', 'Custom integrations']
                          : ['Endpoints API RESTful', 'Respuestas JSON', 'Soporte para webhooks', 'Integraciones personalizadas']
                      }
                    ].map((doc, index) => (
                      <motion.div
                        key={doc.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="font-medium text-slate-800 mb-3 text-sm sm:text-base">{doc.title}</h4>
                        <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4">{doc.description}</p>
                        <div className="space-y-2">
                          {doc.steps.map((step, i) => (
                            <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
                              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {i + 1}
                              </div>
                              <span className="break-words">{step}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Elegante - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 sm:mb-16"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl shadow-lg shadow-blue-500/10 flex items-center justify-center flex-shrink-0"
            >
              <Image 
                src='/imagotipo-principal-sindescriptor.webp'
                alt='DataKnow Logo'
                width={90}
                height={90}
                className='object-cover w-6 h-6 sm:w-8 sm:h-8'
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-light text-slate-800">DataKnow</h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'en' ? 'Intelligent Document Analysis' : 'Análisis Inteligente de Documentos'}
              </p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Language Selector - Mobile Optimized */}
            <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-1 border border-slate-200/50">
              {(['en', 'es'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    language === lang
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-6">
              <button 
                onClick={() => setShowFeaturesModal(true)}
                className="text-slate-600 hover:text-slate-800 transition-colors text-sm font-medium"
              >
                {language === 'en' ? 'Features & Docs' : 'Características'}
              </button>
              
              <button className="bg-white text-slate-700 px-4 py-2 rounded-xl shadow-sm shadow-black/5 border border-slate-200 hover:shadow-md transition-all text-sm font-medium">
                {language === 'en' ? 'Contact' : 'Contacto'}
              </button>
            </div>

            {/* Mobile Menu */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border border-slate-200/50"
            >
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setShowFeaturesModal(true)
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium py-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {language === 'en' ? 'Features & Docs' : 'Características'}
                </button>
                <button className="w-full flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium py-2">
                  <Home className="w-4 h-4" />
                  {language === 'en' ? 'Contact' : 'Contacto'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-16 max-w-4xl mx-auto px-2"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm text-slate-700 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl mb-6 sm:mb-8 shadow-sm border border-slate-200/50"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              {language === 'en' ? 'AI-POWERED ANALYSIS' : 'ANÁLISIS CON IA'}
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 mb-4 sm:mb-6 tracking-tight px-2">
            {t.title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-normal mt-1 sm:mt-2">
              {t.subtitle}
            </span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2">
            {t.description}
          </p>

          {/* Stats - Responsive */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto">
            {['5+', '∞', '99.9%'].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-lg sm:text-xl lg:text-2xl font-light text-slate-800 mb-1">{value}</div>
                <div className="text-xs sm:text-sm text-slate-500">{t.stats[index]}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          {/* Sidebar - Responsive */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="xl:col-span-4"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl shadow-blue-500/5 border border-slate-200/50">
              {/* Upload Card */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-light text-slate-800 mb-2">{t.upload.title}</h2>
                <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6">
                  {t.upload.subtitle}
                </p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-blue-500/25">
                    <Upload className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-medium text-slate-800 mb-2">
                    {t.upload.dropFiles}
                  </h3>
                  
                  <p className="text-slate-500 text-xs sm:text-sm mb-3 sm:mb-4">
                    {t.upload.orClick}
                  </p>

                  <div className="text-xs text-slate-400">
                    {t.upload.maxFiles}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={analyzeDocuments}
                  disabled={isAnalyzing || documents.length === 0 || documents.some(d => d.status === 'uploading')}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{t.actions.startAnalysis}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:border-slate-300 transition-colors text-xs sm:text-sm">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t.actions.search}
                  </button>
                  <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:border-slate-300 transition-colors text-xs sm:text-sm">
                    <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t.actions.filter}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area - Responsive */}
          <div className="xl:col-span-8">
            {/* Tabs - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 sm:p-2 shadow-sm border border-slate-200/50 mb-6 sm:mb-8 w-full xl:w-fit"
            >
              {[
                { id: 'upload' as const, label: t.tabs.documents, count: documents.length },
                { id: 'analysis' as const, label: t.tabs.analysis, count: analysisResult ? analysisResult.documents.length : 0 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 flex-1 xl:flex-initial ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="font-medium text-sm sm:text-base">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {documents.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 sm:py-16"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-600 mb-2">
                        {t.empty.noDocuments}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {t.empty.uploadFirst}
                      </p>
                    </motion.div>
                  ) : (
                    documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-md hover:border-blue-200 ${getStatusColor(doc.status)}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                                <h3 className="font-medium text-slate-800 truncate text-sm sm:text-base">
                                  {doc.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize w-fit ${
                                  doc.type === 'scientific' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {doc.type}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.uploadTime.toLocaleTimeString()}</span>
                              </div>

                              {/* Progress Bar */}
                              {doc.status === 'uploading' && doc.progress && (
                                <div className="mt-2 sm:mt-3">
                                  <div className="w-full bg-slate-200 rounded-full h-1.5 sm:h-2">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${doc.progress}%` }}
                                      className="bg-blue-500 h-1.5 sm:h-2 rounded-full"
                                    />
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    {language === 'en' ? 'Uploading...' : 'Subiendo...'} {doc.progress}%
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {getStatusIcon(doc.status)}
                              <span className="text-xs sm:text-sm font-medium capitalize text-slate-700">
                                {t.status[doc.status]}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => removeDocument(doc.id)}
                              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50 flex-shrink-0"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {!analysisResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 sm:py-16"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-blue-500/25"
                      >
                        <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </motion.div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-600 mb-2">
                        {isAnalyzing ? t.empty.analyzing : t.empty.noResults}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        {isAnalyzing ? t.empty.aiProcessing : t.empty.uploadFirst}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Results Header */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 lg:p-8 text-white"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <Shield className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                          <div>
                            <h2 className="text-xl sm:text-2xl font-light mb-1 sm:mb-2">{t.analysis.complete}</h2>
                            <p className="opacity-90 text-sm sm:text-base">
                              {t.analysis.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Consolidated PDF */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-medium text-slate-800 mb-1 sm:mb-2">
                              {t.analysis.consolidated}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base">
                              {t.analysis.consolidatedDesc}
                            </p>
                          </div>
                          <button
                            onClick={downloadConsolidatedPdf}
                            className="flex items-center gap-2 sm:gap-3 bg-slate-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-slate-700 transition-all duration-300 font-medium group flex-shrink-0"
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm sm:text-base">{t.actions.download}</span>
                          </button>
                        </div>
                      </motion.div>

                      {/* Individual Summaries */}
                      <div className="grid gap-4 sm:gap-6">
                        <h3 className="text-lg sm:text-xl font-medium text-slate-800">
                          {t.analysis.summaries}
                        </h3>
                        
                        {analysisResult.documents.map((doc, index) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-2 ${
                                doc.type === 'scientific' ? 'bg-purple-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                  <h4 className="font-medium text-slate-800 text-sm sm:text-base">{doc.name}</h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                                    doc.type === 'scientific'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {doc.type === 'scientific' 
                                      ? (language === 'en' ? 'Scientific' : 'Científico') 
                                      : (language === 'en' ? 'General' : 'General')}
                                  </span>
                                </div>
                                
                                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                                  {doc.summary}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Features Grid - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20"
        >
          {[
            {
              icon: FileText,
              title: t.features.multiFormat,
              description: t.features.multiFormatDesc
            },
            {
              icon: BarChart3,
              title: t.features.aiAnalysis,
              description: t.features.aiAnalysisDesc
            },
            {
              icon: Download,
              title: t.features.reports,
              description: t.features.reportsDesc
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 border border-slate-200/50 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <h3 className="font-medium text-slate-800 mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Modal */}
      <FeaturesModal />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-4 sm:left-10 w-1 h-1 bg-blue-400 rounded-full"
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-4 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 2, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-4 sm:left-20 w-1 h-1 bg-blue-300 rounded-full"
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.8, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>
    </div>
  )
}