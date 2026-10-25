import React, { useEffect } from 'react'
import { useDatasetPreview } from '../hooks/useApi'
import { Button } from './ui/button'
import { 
  Eye, 
  X, 
  FileText, 
  Database, 
  Award, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  ShoppingCart,
  User,
  Scale
} from 'lucide-react'

interface DatasetPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onContinueToPurchase: () => void
  dataset: {
    id: number
    title: string
    description?: string
    author?: string
    format?: string
    size?: string
    license?: string
    price?: number
  }
  feasibility?: {
    score: number
    grade: string
    ml_readiness: boolean
  }
}

export const DatasetPreviewModal: React.FC<DatasetPreviewModalProps> = ({
  isOpen,
  onClose,
  onContinueToPurchase,
  dataset,
  feasibility
}) => {
  // Fetch up to 15 sample rows for preview
  const { data: previewData, isLoading, error } = useDatasetPreview(dataset.id, 15)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const format = previewData?.format || dataset.format || 'CSV'
  const size = previewData?.size || dataset.size || 'N/A'
  const author = previewData?.author || dataset.author || 'UniData Creator'
  const license = previewData?.license || dataset.license || 'MIT'

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div 
        className="bg-card text-card-foreground border border-border/80 shadow-2xl rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-primary">Pre-Purchase Dataset Preview</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">ID #{dataset.id}</span>
              </div>
              <h2 id="preview-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
                {dataset.title}
              </h2>
              {dataset.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 max-w-3xl">
                  {dataset.description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata & Quality Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-muted/40 border-b border-border/40 text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-muted-foreground text-[11px]">Format</div>
              <div className="font-semibold uppercase">{format}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-muted-foreground text-[11px]">File Size</div>
              <div className="font-semibold">{size}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-muted-foreground text-[11px]">Author</div>
              <div className="font-semibold truncate max-w-[120px]" title={author}>{author}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="text-muted-foreground text-[11px]">License</div>
              <div className="font-semibold">{license}</div>
            </div>
          </div>

          {/* Feasibility Summary */}
          {feasibility && (
            <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-2 p-1.5 rounded-lg bg-card border border-border/60">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground leading-tight">Feasibility</div>
                  <div className="font-bold text-foreground text-xs leading-tight">
                    {feasibility.score}/100 <span className="font-normal text-[11px] text-muted-foreground">(Grade {feasibility.grade})</span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                feasibility.ml_readiness ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {feasibility.ml_readiness ? 'ML Ready' : 'Needs Work'}
              </span>
            </div>
          )}
        </div>

        {/* Modal Body: Sample Rows Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Reading sample records from dataset...</p>
            </div>
          ) : error || (previewData && !previewData.success) ? (
            <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Dataset Preview Currently Unavailable</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {previewData?.error || (error as any)?.message || 'A preview could not be generated for this dataset file.'}
              </p>
            </div>
          ) : previewData && previewData.rows && previewData.rows.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>
                  Showing first <strong>{previewData.rows.length}</strong> rows of column structure
                  {previewData.total_rows ? ` (out of ~${previewData.total_rows.toLocaleString()} total rows)` : ''}
                </span>
                <span className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                  {previewData.columns.length} columns detected
                </span>
              </div>

              {/* Scrollable Data Table */}
              <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm bg-card">
                <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur border-b border-border text-foreground font-semibold">
                      <tr>
                        <th className="p-2.5 w-12 text-center text-muted-foreground font-mono bg-muted/95">#</th>
                        {previewData.columns.map((col, idx) => (
                          <th 
                            key={idx} 
                            className="p-2.5 whitespace-nowrap font-medium border-l border-border/40 text-foreground"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                      {previewData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-2.5 text-center text-muted-foreground/70 bg-muted/10 font-sans text-xs">
                            {rIdx + 1}
                          </td>
                          {previewData.columns.map((col, cIdx) => {
                            const val = row[col]
                            const displayVal = val !== null && val !== undefined 
                              ? (typeof val === 'object' ? JSON.stringify(val) : String(val))
                              : null
                            return (
                              <td 
                                key={cIdx} 
                                className="p-2.5 whitespace-nowrap border-l border-border/30 max-w-xs truncate text-foreground/90"
                                title={displayVal ?? 'null'}
                              >
                                {displayVal !== null ? (
                                  displayVal
                                ) : (
                                  <span className="text-muted-foreground/40 italic font-sans text-[10px]">null</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground space-y-2">
              <Database className="w-8 h-8 mx-auto text-muted-foreground/50" />
              <p className="text-sm">No sample rows found in this dataset.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border/60 bg-muted/20">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Read-only sample preview. Full dataset download access is granted upon purchase.</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close Preview
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onContinueToPurchase}
              className="text-xs flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Continue to Purchase</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatasetPreviewModal
