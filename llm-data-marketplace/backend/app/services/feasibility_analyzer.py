# Feasibility Analyzer Service for Dataset and Model Analysis
# Author: GauravPatil2515
# Date: 2025-08-23

import os
import json
import tempfile
import warnings
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import numpy as np
import pandas as pd
from collections import Counter
import zipfile

warnings.filterwarnings('ignore')

class DatasetFeasibilityAnalyzer:
    """Analyzes uploaded datasets for feasibility and quality scoring"""
    
    def __init__(self):
        self.tabular_ext = ['.csv', '.xlsx', '.xls']
        self.image_ext = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp']
    
    def analyze_dataset(self, file_path: str, filename: str) -> Dict[str, Any]:
        """Main analysis function for datasets"""
        try:
            file_ext = os.path.splitext(filename)[1].lower()
            
            if file_ext == '.zip':
                return self._analyze_zip_dataset(file_path, filename)
            elif file_ext in self.tabular_ext:
                return self._analyze_tabular_dataset(file_path, filename)
            else:
                return self._create_error_result(f"Unsupported file type: {file_ext}")
                
        except Exception as e:
            return self._create_error_result(f"Analysis failed: {str(e)}")
    
    def _analyze_zip_dataset(self, zip_path: str, filename: str) -> Dict[str, Any]:
        """Analyze ZIP file containing dataset"""
        extract_dir = tempfile.mkdtemp()
        
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
            
            # Find files
            tabular_files = []
            image_folders = []
            
            for root, dirs, files in os.walk(extract_dir):
                images_in_folder = []
                
                for file in files:
                    file_path = os.path.join(root, file)
                    ext = os.path.splitext(file)[1].lower()
                    
                    if ext in self.tabular_ext:
                        tabular_files.append(file_path)
                    elif ext in self.image_ext:
                        images_in_folder.append(file_path)
                
                if images_in_folder:
                    folder_name = os.path.basename(root) if root != extract_dir else "images"
                    image_folders.append({'name': folder_name, 'images': images_in_folder})
            
            # Analyze based on what we found
            if tabular_files:
                return self._analyze_tabular_dataset(tabular_files[0], filename)
            elif image_folders:
                return self._analyze_image_dataset(image_folders, filename)
            else:
                return self._create_error_result("No supported files found in ZIP")
                
        except Exception as e:
            return self._create_error_result(f"ZIP analysis failed: {str(e)}")
        finally:
            # Cleanup
            import shutil
            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir, ignore_errors=True)
    
    def _analyze_tabular_dataset(self, file_path: str, filename: str) -> Dict[str, Any]:
        """Analyze tabular dataset (CSV/Excel)"""
        try:
            # Load data
            ext = os.path.splitext(filename)[1].lower()
            if ext == '.csv':
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            
            # Sample if too large
            original_size = len(df)
            if len(df) > 10000:
                df = df.sample(10000, random_state=42)
            
            # Calculate metrics
            score, issues, strengths = self._score_tabular_dataset(df)
            
            # Get detailed statistics
            stats = self._get_tabular_stats(df)
            
            return {
                'success': True,
                'type': 'tabular',
                'score': score,
                'grade': self._get_grade(score),
                'analysis_date': datetime.now().isoformat(),
                'dataset_info': {
                    'filename': filename,
                    'rows': original_size,
                    'columns': len(df.columns),
                    'size_mb': os.path.getsize(file_path) / (1024 * 1024),
                    'sampled': original_size > 10000
                },
                'quality_metrics': {
                    'missing_data_percentage': stats['missing_percentage'],
                    'duplicate_rows_percentage': stats['duplicate_percentage'],
                    'numeric_columns': stats['numeric_columns'],
                    'categorical_columns': stats['categorical_columns'],
                    'unique_values_per_column': stats['unique_values']
                },
                'feasibility_analysis': {
                    'issues': issues,
                    'strengths': strengths,
                    'ml_readiness': score >= 70,
                    'recommended_use_cases': self._suggest_use_cases(df, score)
                },
                'recommendations': self._generate_tabular_recommendations(issues, strengths, score)
            }
            
        except Exception as e:
            return self._create_error_result(f"Tabular analysis failed: {str(e)}")
    
    def _analyze_image_dataset(self, image_folders: List[Dict], filename: str) -> Dict[str, Any]:
        """Analyze image dataset"""
        try:
            # Collect all images
            all_images = []
            classes = {}
            
            for folder in image_folders:
                class_name = folder['name']
                images = folder['images']
                classes[class_name] = len(images)
                all_images.extend(images)
            
            # Analyze images (sample for performance)
            sample_size = min(100, len(all_images))
            sample_images = np.random.choice(all_images, sample_size, replace=False) if len(all_images) > sample_size else all_images
            
            valid_count = 0
            broken_count = 0
            formats = Counter()
            sizes = []
            
            for img_path in sample_images:
                try:
                    from PIL import Image
                    with Image.open(img_path) as img:
                        formats[img.format] += 1
                        sizes.append(img.size)
                        valid_count += 1
                except:
                    broken_count += 1
            
            # Scale up counts if sampled
            if len(sample_images) < len(all_images):
                scale_factor = len(all_images) / len(sample_images)
                valid_count = int(valid_count * scale_factor)
                broken_count = int(broken_count * scale_factor)
            
            # Calculate score
            avg_size = np.mean([min(s) for s in sizes]) if sizes else 0
            score, issues, strengths = self._score_image_dataset(
                len(all_images), valid_count, broken_count, classes, avg_size
            )
            
            return {
                'success': True,
                'type': 'image',
                'score': score,
                'grade': self._get_grade(score),
                'analysis_date': datetime.now().isoformat(),
                'dataset_info': {
                    'filename': filename,
                    'total_images': len(all_images),
                    'classes': len(classes),
                    'main_format': max(formats, key=formats.get) if formats else 'Unknown',
                    'average_resolution': int(avg_size) if avg_size > 0 else 'Unknown'
                },
                'quality_metrics': {
                    'valid_images': valid_count,
                    'broken_images': broken_count,
                    'corruption_rate': (broken_count / len(all_images)) * 100 if all_images else 0,
                    'class_distribution': classes,
                    'images_per_class': {k: v for k, v in classes.items()}
                },
                'feasibility_analysis': {
                    'issues': issues,
                    'strengths': strengths,
                    'ml_readiness': score >= 70,
                    'recommended_use_cases': self._suggest_image_use_cases(classes, score)
                },
                'recommendations': self._generate_image_recommendations(issues, strengths, score)
            }
            
        except Exception as e:
            return self._create_error_result(f"Image analysis failed: {str(e)}")
    
    def _score_tabular_dataset(self, df: pd.DataFrame) -> Tuple[float, List[str], List[str]]:
        """Score tabular dataset and identify issues/strengths"""
        score = 100.0
        issues = []
        strengths = []
        
        # Missing values
        missing_pct = (df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100
        if missing_pct > 50:
            score -= 30
            issues.append(f"High missing data ({missing_pct:.1f}%)")
        elif missing_pct > 20:
            score -= 15
            issues.append(f"Moderate missing data ({missing_pct:.1f}%)")
        elif missing_pct < 5:
            strengths.append("Low missing data")
        
        # Dataset size
        n_rows, n_cols = df.shape
        if n_rows < 100:
            score -= 25
            issues.append("Very small dataset")
        elif n_rows < 500:
            score -= 10
            issues.append("Small dataset")
        elif n_rows > 1000:
            strengths.append("Good sample size")
        
        # Features
        if n_cols < 3:
            score -= 15
            issues.append("Few features")
        elif n_cols > 50:
            score -= 5
            issues.append("Many features")
        else:
            strengths.append("Good feature count")
        
        # Duplicates
        dup_pct = (df.duplicated().sum() / len(df)) * 100
        if dup_pct > 10:
            score -= 10
            issues.append(f"Duplicate rows ({dup_pct:.1f}%)")
        
        # Data types
        numeric_ratio = len(df.select_dtypes(include=[np.number]).columns) / len(df.columns)
        if numeric_ratio > 0.3:
            strengths.append("Good numeric data")
        
        return max(0, min(100, score)), issues, strengths
    
    def _score_image_dataset(self, total: int, valid: int, broken: int, classes: Dict, avg_size: float) -> Tuple[float, List[str], List[str]]:
        """Score image dataset and identify issues/strengths"""
        score = 100.0
        issues = []
        strengths = []
        
        # Corruption
        if broken > 0:
            corruption_rate = (broken / total) * 100
            score -= corruption_rate * 0.5
            issues.append(f"Corrupted images ({broken})")
        else:
            strengths.append("No corrupted images")
        
        # Dataset size
        if total < 100:
            score -= 20
            issues.append("Small dataset")
        elif total > 1000:
            strengths.append("Large dataset")
        
        # Class balance
        if len(classes) > 1:
            counts = list(classes.values())
            min_count, max_count = min(counts), max(counts)
            imbalance = 1 - (min_count / max_count)
            
            if imbalance > 0.5:
                score -= 15
                issues.append(f"Class imbalance")
            elif imbalance < 0.2:
                strengths.append("Well balanced classes")
        
        # Technical quality
        if avg_size < 64:
            score -= 10
            issues.append("Low resolution")
        elif avg_size >= 224:
            strengths.append("Good resolution")
        
        return max(0, min(100, score)), issues, strengths
    
    def _get_tabular_stats(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Get detailed statistics for tabular data"""
        return {
            'missing_percentage': (df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100,
            'duplicate_percentage': (df.duplicated().sum() / len(df)) * 100,
            'numeric_columns': len(df.select_dtypes(include=[np.number]).columns),
            'categorical_columns': len(df.select_dtypes(include=['object']).columns),
            'unique_values': {col: df[col].nunique() for col in df.columns[:10]}  # First 10 columns
        }
    
    def _suggest_use_cases(self, df: pd.DataFrame, score: float) -> List[str]:
        """Suggest ML use cases based on dataset characteristics"""
        use_cases = []
        
        if score >= 80:
            use_cases.extend(["Classification", "Regression", "Deep Learning"])
        elif score >= 60:
            use_cases.extend(["Classification", "Regression"])
        else:
            use_cases.append("Data Preprocessing Required")
        
        # Based on data characteristics
        if len(df.select_dtypes(include=[np.number]).columns) > 0:
            use_cases.append("Numerical Analysis")
        
        if len(df.select_dtypes(include=['object']).columns) > 0:
            use_cases.append("Text/Categorical Analysis")
        
        return list(set(use_cases))
    
    def _suggest_image_use_cases(self, classes: Dict, score: float) -> List[str]:
        """Suggest ML use cases for image datasets"""
        use_cases = []
        
        if len(classes) > 1:
            use_cases.append("Image Classification")
        else:
            use_cases.append("Feature Extraction")
        
        if score >= 80:
            use_cases.extend(["Deep Learning", "Transfer Learning"])
        elif score >= 60:
            use_cases.append("Traditional ML")
        
        return use_cases
    
    def _generate_tabular_recommendations(self, issues: List[str], strengths: List[str], score: float) -> List[Dict[str, str]]:
        """Generate actionable recommendations for tabular datasets"""
        recommendations = []
        
        for issue in issues:
            if "missing data" in issue:
                recommendations.append({
                    'type': 'Data Quality',
                    'issue': issue,
                    'action': 'Consider imputation strategies or remove incomplete records',
                    'priority': 'High' if 'High' in issue else 'Medium'
                })
            elif "small dataset" in issue.lower():
                recommendations.append({
                    'type': 'Data Size',
                    'issue': issue,
                    'action': 'Collect more data or use data augmentation techniques',
                    'priority': 'High'
                })
            elif "duplicate" in issue:
                recommendations.append({
                    'type': 'Data Quality',
                    'issue': issue,
                    'action': 'Remove duplicate rows to improve data quality',
                    'priority': 'Medium'
                })
        
        if score < 60:
            recommendations.append({
                'type': 'Overall',
                'issue': 'Low feasibility score',
                'action': 'Address data quality issues before ML model training',
                'priority': 'High'
            })
        
        return recommendations
    
    def _generate_image_recommendations(self, issues: List[str], strengths: List[str], score: float) -> List[Dict[str, str]]:
        """Generate actionable recommendations for image datasets"""
        recommendations = []
        
        for issue in issues:
            if "corrupted" in issue.lower():
                recommendations.append({
                    'type': 'Data Quality',
                    'issue': issue,
                    'action': 'Remove or repair corrupted image files',
                    'priority': 'High'
                })
            elif "small dataset" in issue.lower():
                recommendations.append({
                    'type': 'Data Size',
                    'issue': issue,
                    'action': 'Use data augmentation or collect more images',
                    'priority': 'Medium'
                })
            elif "imbalance" in issue.lower():
                recommendations.append({
                    'type': 'Data Distribution',
                    'issue': issue,
                    'action': 'Balance classes through sampling or augmentation',
                    'priority': 'Medium'
                })
        
        return recommendations
    
    def _get_grade(self, score: float) -> str:
        """Convert score to letter grade"""
        if score >= 90: return 'A'
        elif score >= 80: return 'B'
        elif score >= 70: return 'C'
        elif score >= 60: return 'D'
        else: return 'F'
    
    def _create_error_result(self, error_message: str) -> Dict[str, Any]:
        """Create standardized error result"""
        return {
            'success': False,
            'error': error_message,
            'analysis_date': datetime.now().isoformat()
        }


class ModelFeasibilityAnalyzer:
    """Analyzes uploaded ML models for feasibility and quality scoring"""
    
    def __init__(self):
        self.supported_extensions = ['.h5', '.hdf5', '.pt', '.pth', '.pkl', '.joblib']
    
    def analyze_model(self, file_path: str, filename: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Main analysis function for ML models"""
        try:
            framework = self._detect_framework(filename)
            model_info = self._extract_model_info(file_path, framework)
            
            if not model_info:
                return self._create_error_result("Could not extract model information")
            
            # Calculate usability score
            usability_score = self._calculate_usability_score(model_info, metadata or {})
            
            return {
                'success': True,
                'type': 'model',
                'framework': framework,
                'score': usability_score,
                'grade': self._get_grade(usability_score),
                'analysis_date': datetime.now().isoformat(),
                'model_info': model_info,
                'feasibility_analysis': {
                    'deployment_ready': usability_score >= 70,
                    'complexity_level': self._assess_complexity(model_info),
                    'estimated_inference_time': self._estimate_inference_time(model_info),
                    'memory_requirements': self._estimate_memory_requirements(model_info)
                },
                'recommendations': self._generate_model_recommendations(model_info, usability_score)
            }
            
        except Exception as e:
            return self._create_error_result(f"Model analysis failed: {str(e)}")
    
    def _detect_framework(self, filename: str) -> str:
        """Detect ML framework from file extension"""
        ext = os.path.splitext(filename)[1].lower()
        
        if ext in ['.h5', '.hdf5']:
            return 'tensorflow/keras'
        elif ext in ['.pt', '.pth']:
            return 'pytorch'
        elif ext in ['.pkl', '.joblib']:
            return 'scikit-learn'
        else:
            return 'unknown'
    
    def _extract_model_info(self, model_path: str, framework: str) -> Optional[Dict[str, Any]]:
        """Extract model information based on framework"""
        try:
            if framework == 'tensorflow/keras':
                return self._analyze_tensorflow_model(model_path)
            elif framework == 'pytorch':
                return self._analyze_pytorch_model(model_path)
            elif framework == 'scikit-learn':
                return self._analyze_sklearn_model(model_path)
            else:
                return None
        except Exception as e:
            print(f"Error extracting model info: {str(e)}")
            return None
    
    def _analyze_tensorflow_model(self, model_path: str) -> Dict[str, Any]:
        """Analyze TensorFlow/Keras model (simplified without actual loading)"""
        # Since we can't import TensorFlow in this environment,
        # we'll return basic file-based analysis
        model_size_mb = os.path.getsize(model_path) / (1024 * 1024)
        
        return {
            'model_type': 'TensorFlow/Keras Model',
            'model_size_mb': round(model_size_mb, 2),
            'framework': 'tensorflow',
            'estimated_parameters': self._estimate_params_from_size(model_size_mb, 'tensorflow')
        }
    
    def _analyze_pytorch_model(self, model_path: str) -> Dict[str, Any]:
        """Analyze PyTorch model (simplified without actual loading)"""
        model_size_mb = os.path.getsize(model_path) / (1024 * 1024)
        
        return {
            'model_type': 'PyTorch Model',
            'model_size_mb': round(model_size_mb, 2),
            'framework': 'pytorch',
            'estimated_parameters': self._estimate_params_from_size(model_size_mb, 'pytorch')
        }
    
    def _analyze_sklearn_model(self, model_path: str) -> Dict[str, Any]:
        """Analyze Scikit-learn model (simplified without actual loading)"""
        model_size_mb = os.path.getsize(model_path) / (1024 * 1024)
        
        return {
            'model_type': 'Scikit-learn Model',
            'model_size_mb': round(model_size_mb, 2),
            'framework': 'scikit-learn',
            'estimated_parameters': 'N/A (Traditional ML)'
        }
    
    def _estimate_params_from_size(self, size_mb: float, framework: str) -> str:
        """Estimate parameter count from file size"""
        if framework in ['tensorflow', 'pytorch']:
            # Rough estimation: 4 bytes per parameter (float32)
            estimated_params = int((size_mb * 1024 * 1024) / 4)
            
            if estimated_params > 1000000:
                return f"~{estimated_params // 1000000}M parameters"
            elif estimated_params > 1000:
                return f"~{estimated_params // 1000}K parameters"
            else:
                return f"~{estimated_params} parameters"
        
        return "N/A"
    
    def _calculate_usability_score(self, model_info: Dict[str, Any], metadata: Dict[str, Any]) -> float:
        """Calculate usability score (0-100)"""
        score = 100.0
        
        # Model size considerations
        size_mb = model_info.get('model_size_mb', 0)
        if size_mb < 0.1:  # Very small model
            score -= 10
        elif size_mb > 1000:  # Very large model (>1GB)
            score -= 20
        elif size_mb > 500:  # Large model
            score -= 10
        elif 1 <= size_mb <= 100:  # Good size range
            score += 5
        
        # Framework bonus (more popular frameworks get slight bonus)
        framework = model_info.get('framework', '')
        if framework in ['tensorflow', 'pytorch']:
            score += 5
        elif framework == 'scikit-learn':
            score += 3
        
        # Metadata availability
        if metadata:
            score += 10  # Bonus for having metadata
        
        return max(0, min(100, round(score, 2)))
    
    def _assess_complexity(self, model_info: Dict[str, Any]) -> str:
        """Assess model complexity level"""
        size_mb = model_info.get('model_size_mb', 0)
        framework = model_info.get('framework', '')
        
        if framework == 'scikit-learn':
            return 'Low'
        elif size_mb < 10:
            return 'Low'
        elif size_mb < 100:
            return 'Medium'
        else:
            return 'High'
    
    def _estimate_inference_time(self, model_info: Dict[str, Any]) -> str:
        """Estimate inference time category"""
        size_mb = model_info.get('model_size_mb', 0)
        framework = model_info.get('framework', '')
        
        if framework == 'scikit-learn' or size_mb < 1:
            return 'Fast (<10ms)'
        elif size_mb < 50:
            return 'Medium (10-100ms)'
        else:
            return 'Slow (>100ms)'
    
    def _estimate_memory_requirements(self, model_info: Dict[str, Any]) -> str:
        """Estimate memory requirements"""
        size_mb = model_info.get('model_size_mb', 0)
        
        # Rough estimation: model size + working memory
        estimated_memory = size_mb * 2  # 2x for working memory
        
        if estimated_memory < 100:
            return f'Low (~{int(estimated_memory)}MB)'
        elif estimated_memory < 1000:
            return f'Medium (~{int(estimated_memory)}MB)'
        else:
            return f'High (~{estimated_memory/1024:.1f}GB)'
    
    def _generate_model_recommendations(self, model_info: Dict[str, Any], score: float) -> List[Dict[str, str]]:
        """Generate actionable recommendations for models"""
        recommendations = []
        
        size_mb = model_info.get('model_size_mb', 0)
        
        if size_mb > 500:
            recommendations.append({
                'type': 'Optimization',
                'issue': f'Large model size ({size_mb:.1f}MB)',
                'action': 'Consider model compression or quantization',
                'priority': 'Medium'
            })
        elif size_mb < 0.1:
            recommendations.append({
                'type': 'Verification',
                'issue': f'Very small model ({size_mb:.1f}MB)',
                'action': 'Verify model completeness and functionality',
                'priority': 'Low'
            })
        
        if score < 60:
            recommendations.append({
                'type': 'Overall',
                'issue': 'Low usability score',
                'action': 'Review model architecture and optimization opportunities',
                'priority': 'High'
            })
        
        # Framework-specific recommendations
        framework = model_info.get('framework', '')
        if framework == 'unknown':
            recommendations.append({
                'type': 'Documentation',
                'issue': 'Unknown framework',
                'action': 'Provide clear documentation about model framework and usage',
                'priority': 'High'
            })
        
        return recommendations
    
    def _get_grade(self, score: float) -> str:
        """Convert score to letter grade"""
        if score >= 90: return 'A'
        elif score >= 80: return 'B'
        elif score >= 70: return 'C'
        elif score >= 60: return 'D'
        else: return 'F'
    
    def _create_error_result(self, error_message: str) -> Dict[str, Any]:
        """Create standardized error result"""
        return {
            'success': False,
            'error': error_message,
            'analysis_date': datetime.now().isoformat()
        }
