import React from 'react'
import { Link } from 'react-router-dom'
import { StaggerContainer, StaggerItem } from './animations/StaggerAnimation'
import { 
  Upload, 
  BarChart3, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  TrendingUp,
  Shield
} from 'lucide-react'
import { Button } from './ui/button'

export const WorkflowShowcase: React.FC = () => {
  return (
    <section className="py-12" style={{ backgroundColor: '#0B0E11', fontFamily: 'Space Grotesk, sans-serif' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4"
               style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}>
            ✨ NEW: AI-Powered Workflow
          </div>
          <h2 className="mb-4" 
              style={{ 
                fontFamily: '"Space Grotesk", sans-serif', 
                fontSize: '32px', 
                fontWeight: 700, 
                lineHeight: '40px', 
                letterSpacing: 'normal',
                color: '#FFFFFF'
              }}>
            Upload → Analyze → Sell
          </h2>
          <p className="max-w-2xl mx-auto font-light" 
             style={{ 
               fontFamily: '"Space Grotesk", sans-serif', 
               fontSize: '16px', 
               fontWeight: 400, 
               lineHeight: '24px', 
               letterSpacing: 'normal',
               color: 'rgba(255, 255, 255, 0.7)'
             }}>
            Revolutionary 3-step process with automatic feasibility scoring and instant market access
          </p>
        </div>

        <StaggerContainer>
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <StaggerItem>
              {/* Step 1: Upload & Analysis */}
              <div className="text-center hover-lift">
                <div className="mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center border animate-glow"
                     style={{ 
                       backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                       borderColor: 'rgba(255, 255, 255, 0.1)' 
                     }}>
                  <Upload className="w-8 h-8 animate-float" style={{ color: '#F0B90B' }} />
                </div>
                <div className="mb-4">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2"
                       style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}>
                    Step 1
                  </div>
                  <h3 className="mb-2" 
                      style={{ 
                        fontFamily: '"Space Grotesk", sans-serif', 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        lineHeight: '40px', 
                        letterSpacing: 'normal',
                        color: '#FFFFFF'
                      }}>
                    Upload & Analyze
                  </h3>
                  <p className="font-light mb-4" 
                     style={{ 
                       fontFamily: '"Space Grotesk", sans-serif', 
                       fontSize: '14px', 
                       fontWeight: 400, 
                       lineHeight: '20px',
                       color: 'rgba(255, 255, 255, 0.7)'
                     }}>
                    Upload your dataset and get instant AI-powered feasibility analysis
                  </p>
                </div>

            <div className="space-y-2 mb-4 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Automatic quality scoring (0-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Comprehensive feasibility report</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Improvement recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Market viability assessment</span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border mb-4"
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                   borderColor: 'rgba(255, 255, 255, 0.1)' 
                 }}>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4" style={{ color: '#F0B90B' }} />
                <span className="font-medium text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Example Score</span>
              </div>
              <div className="text-xl font-bold mb-1 leading-tight" style={{ color: '#F0B90B' }}>8.7/10 (A-)</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Excellent commercial potential</div>
            </div>

            <Button asChild className="w-full py-2 text-sm hover:opacity-90 transition-opacity hover-glow"
                    style={{ backgroundColor: '#F0B90B', color: '#0B0E11', fontWeight: '500' }}>
              <Link to="/upload-dataset">
                Start Upload <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
              </div>
            </StaggerItem>

            <StaggerItem>
              {/* Step 2: Listing & Discovery */}
              <div className="text-center hover-lift">
                <div className="mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center border animate-glow"
                     style={{ 
                       backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                       borderColor: 'rgba(255, 255, 255, 0.1)' 
                     }}>
                  <BarChart3 className="w-8 h-8 animate-bounce-subtle" style={{ color: '#F0B90B' }} />
                </div>
                <div className="mb-4">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2"
                       style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}>
                    Step 2
                  </div>
                  <h3 
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '32px',
                      fontWeight: 700,
                      lineHeight: '40px',
                      color: '#FFFFFF'
                    }}
                    className="mb-2"
                  >
                    List & Discover
                  </h3>
                  <p className="font-light leading-relaxed mb-4 text-sm"
                     style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Automatic marketplace listing with quality badges and smart categorization
                  </p>
                </div>

            <div className="space-y-2 mb-4 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Quality grade badges (A+ to F)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Smart categorization & tagging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Advanced search & filtering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Preview & sample data</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border mb-4"
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                   borderColor: 'rgba(255, 255, 255, 0.1)' 
                 }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" style={{ color: '#F0B90B' }} />
                <span className="font-medium text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Visibility</span>
              </div>
              <div className="text-xl font-bold mb-1 leading-tight" style={{ color: '#F0B90B' }}>Global</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Instant marketplace presence</div>
            </div>

            <Button asChild variant="outline" className="w-full border py-2 text-sm hover:bg-white/5 transition-colors hover-scale"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', backgroundColor: 'transparent' }}>
              <Link to="/marketplace">
                Browse Market <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
              </div>
            </StaggerItem>

            <StaggerItem>
              {/* Step 3: Purchase & Monetize */}
              <div className="text-center hover-lift">
                <div className="mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center border animate-glow"
                     style={{ 
                       backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                       borderColor: 'rgba(255, 255, 255, 0.1)' 
                     }}>
                  <Wallet className="w-8 h-8 animate-pulse-slow" style={{ color: '#F0B90B' }} />
                </div>
            <div className="mb-4">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2"
                   style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}>
                Step 3
              </div>
              <h3 
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: '40px',
                  color: '#FFFFFF'
                }}
                className="mb-2"
              >
                Purchase & Earn
              </h3>
              <p className="font-light leading-relaxed mb-4 text-sm"
                 style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Secure blockchain transactions with instant delivery and revenue tracking
              </p>
            </div>

            <div className="space-y-2 mb-4 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>One-click secure purchases</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Instant download access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Revenue analytics & tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B90B' }} />
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Automated royalty payments</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border mb-4"
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                   borderColor: 'rgba(255, 255, 255, 0.1)' 
                 }}>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4" style={{ color: '#F0B90B' }} />
                <span className="font-medium text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Security</span>
              </div>
              <div className="text-xl font-bold mb-1 leading-tight" style={{ color: '#F0B90B' }}>100%</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Blockchain secured</div>
            </div>

            <Button asChild variant="outline" className="w-full border py-2 text-sm hover:bg-white/5 transition-colors hover-scale"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', backgroundColor: 'transparent' }}>
              <Link to="/datasets/1">
                View Example <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Subtle Divider */}
        <div className="w-full h-px mb-8" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>

        {/* Call to Action */}
        <div className="text-center">
          
        </div>
      </div>
    </section>
  )
}
