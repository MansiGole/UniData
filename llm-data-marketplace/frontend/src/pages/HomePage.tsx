import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { WorkflowShowcase } from '../components/WorkflowShowcase'
import { useWallet } from '../hooks/useWallet'
import { Database, ArrowRight, Upload, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import PageTransition from '../components/animations/PageTransition'
import AnimateOnScroll from '../components/animations/AnimateOnScroll'
import { StaggerContainer, StaggerItem } from '../components/animations/StaggerAnimation'

export const HomePage: React.FC = () => {
  const { isConnected } = useWallet()

  return (
    <PageTransition>
      <div className="flex flex-col" style={{ backgroundColor: '#0B0E11', fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl font-bold mb-6 leading-normal text-center capitalize" 
            style={{ 
              fontFamily: '"Space Grotesk", sans-serif', 
              fontWeight: 700, 
              fontSize: '80px', 
              lineHeight: 'normal', 
              letterSpacing: 'normal', 
              textTransform: 'capitalize',
              color: '#FFFFFF'
            }}>
            Decentralized Data
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="block" 
              style={{ color: '#F0B90B' }}>
              Marketplace
            </motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base mb-8 max-w-3xl mx-auto leading-relaxed text-center"
            style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 400, lineHeight: '1.5' }}>
            Buy and sell high-quality datasets securely using blockchain technology. 
            Powered by BNB Smart Chain for fast, low-cost transactions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isConnected ? (
              <>
                <Link to="/marketplace">
                  <Button size="lg" 
                          className="flex items-center space-x-2 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity hover-lift"
                          style={{ backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' }}>
                    <span>Explore Marketplace</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/upload-dataset">
                  <Button variant="outline" 
                          size="lg" 
                          className="flex items-center space-x-2 border px-6 py-3 rounded-lg hover:bg-white/5 transition-colors hover-scale"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', backgroundColor: 'transparent' }}>
                    <Upload className="h-4 w-4" />
                    <span>Upload Dataset</span>
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Connect your wallet to start exploring datasets
              </div>
            )}
            
            <Link to="/datasets">
              <Button variant="outline" 
                      size="lg" 
                      className="border px-6 py-3 rounded-lg hover:bg-white/5 transition-colors hover-scale"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', backgroundColor: 'transparent' }}>
                Browse All Datasets
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 rounded-full flex justify-center"
               style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="w-1 h-3 rounded-full mt-2"
                 style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
          </div>
        </motion.div>
      </section>

      {/* Workflow Showcase */}
      <AnimateOnScroll direction="up">
        <section className="min-h-screen flex items-center justify-center">
          <WorkflowShowcase />
        </section>
      </AnimateOnScroll>

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-current to-transparent"
           style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>

      {/* Upload Section */}
      <AnimateOnScroll direction="up">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              
              <h2 
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: '40px',
                  color: '#FFFFFF'
                }}
                className="mb-2"
              >
                Share Your Data & Models
              </h2>
              <p className="text-sm max-w-2xl mx-auto leading-relaxed"
                 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Upload your datasets and ML models to earn tBNB and contribute to the community. 
                Join our ecosystem of data providers and help advance AI research globally.
              </p>
            </div>

            <StaggerContainer>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <StaggerItem>
                  <Card className="border-2 transition-all duration-300 hover:scale-105 p-4 hover-lift"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                          borderColor: 'rgba(240, 185, 11, 0.2)',
                        }}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 animate-float"
                           style={{ backgroundColor: 'rgba(240, 185, 11, 0.1)' }}>
                        <Database className="h-6 w-6" style={{ color: '#F0B90B' }} />
                      </div>
                      <CardTitle className="text-lg mb-2 leading-tight" style={{ color: '#FFFFFF', fontWeight: '700' }}>Upload Dataset</CardTitle>
                      <CardDescription className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Share your cleaned, structured datasets with the community and monetize your data
                      </CardDescription>
                    </CardHeader>
              <CardContent className="text-center">
                <ul className="text-xs mb-4 space-y-1 text-left leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    CSV, JSON, Parquet formats supported
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    Set your own pricing strategy
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    Instant tBNB payments on purchase
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    Global marketplace reach
                  </li>
                </ul>
                <Link to="/upload-dataset">
                  <Button className="w-full py-2 text-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' }}>
                    <Upload className="h-3 w-3 mr-2" />
                    Upload Dataset
                  </Button>
                </Link>
              </CardContent>
                  </Card>
                </StaggerItem>

                <StaggerItem>
                  <Card className="border-2 transition-all duration-300 hover:scale-105 p-4 hover-lift"
                        style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                          borderColor: 'rgba(240, 185, 11, 0.2)',
                        }}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 animate-float"
                           style={{ backgroundColor: 'rgba(240, 185, 11, 0.1)' }}>
                        <Brain className="h-6 w-6" style={{ color: '#F0B90B' }} />
                      </div>
                      <CardTitle className="text-lg mb-2 leading-tight" style={{ color: '#FFFFFF', fontWeight: '700' }}>Upload ML Model</CardTitle>
                      <CardDescription className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Share your trained machine learning models and algorithms with researchers worldwide
                      </CardDescription>
                    </CardHeader>
              <CardContent className="text-center">
                <ul className="text-xs mb-4 space-y-1 text-left leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    All major frameworks supported
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    Include performance metrics
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    Monetize your AI research
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: '#F0B90B' }}></span>
                    Build your ML reputation
                  </li>
                </ul>
                <Link to="/upload-model">
                  <Button variant="outline" className="w-full border py-2 text-sm hover:bg-white/5 transition-colors"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', backgroundColor: 'transparent' }}>
                    <Brain className="h-3 w-3 mr-2" />
                    Upload Model
                  </Button>
                </Link>
              </CardContent>
                  </Card>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>
      </AnimateOnScroll>

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-current to-transparent"
           style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>

      {/* How It Works */}
      <AnimateOnScroll direction="up">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              
              <h2 
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: '40px',
                  color: '#FFFFFF'
                }}
                className="mb-2"
              >
                How It Works
              </h2>
              <p className="text-sm max-w-2xl mx-auto leading-relaxed"
                 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Simple steps to buy and sell datasets securely on the blockchain
              </p>
            </div>

            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <StaggerItem>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow"
                         style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)' }}>
                      <span className="text-lg font-bold" style={{ color: '#F0B90B' }}>1</span>
                    </div>
              <h3 
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  color: 'rgb(196, 197, 203)',
                  letterSpacing: 'normal'
                }}
                className="mb-2"
              >
                Connect Wallet
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Connect your MetaMask wallet to the BNB Smart Chain testnet and start exploring
                the decentralized marketplace
              </p>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow"
                         style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)' }}>
                      <span className="text-lg font-bold" style={{ color: '#F0B90B' }}>2</span>
                    </div>
                    <h3 
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '24px',
                        color: 'rgb(196, 197, 203)',
                        letterSpacing: 'normal'
                      }}
                      className="mb-2"
                    >
                      Browse Datasets
                    </h3>
                    <p className="leading-relaxed text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Explore our marketplace of verified, high-quality datasets across various domains
                      and find the perfect data for your project
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="text-center group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow"
                         style={{ backgroundColor: 'rgba(240, 185, 11, 0.2)' }}>
                      <span className="text-lg font-bold" style={{ color: '#F0B90B' }}>3</span>
                    </div>
                    <h3 
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '24px',
                        color: 'rgb(196, 197, 203)',
                        letterSpacing: 'normal'
                      }}
                      className="mb-2"
                    >
                      Purchase Securely
                    </h3>
                    <p className="leading-relaxed text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Buy datasets instantly with tBNB using smart contracts. Secure, transparent,
                      and automated transactions guaranteed
                    </p>
                  </div>
                </StaggerItem>
              </div>
            </StaggerContainer>

            <AnimateOnScroll direction="up" delay={0.3}>
              <div className="text-center mt-8">
                <Link to="/marketplace">
                  <Button size="lg" className="px-6 py-3 hover:opacity-90 transition-opacity hover-lift"
                          style={{ backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' }}>
                    Start Exploring
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </AnimateOnScroll>
    </div>
    </PageTransition>
  )
}
