#!/usr/bin/env python3
"""
Setup script for BNB Greenfield integration tests

This script helps set up the environment for testing Greenfield integration.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_python_requirements():
    """Check if Python requirements are installed"""
    print("🐍 Checking Python requirements...")
    
    required_packages = ['pytest', 'requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package} is installed")
        except ImportError:
            print(f"  ❌ {package} is missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Installing missing packages: {', '.join(missing_packages)}")
        return run_command(f"pip install {' '.join(missing_packages)}", "Installing Python packages")
    
    return True

def check_node_requirements():
    """Check if Node.js and npm are available"""
    print("📦 Checking Node.js requirements...")
    
    # Check if Node.js is installed
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✅ Node.js {result.stdout.strip()} is installed")
        else:
            print("  ❌ Node.js is not working properly")
            return False
    except FileNotFoundError:
        print("  ❌ Node.js is not installed")
        print("     Please install Node.js from https://nodejs.org/")
        return False
    
    # Check if npm is installed
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✅ npm {result.stdout.strip()} is installed")
        else:
            print("  ❌ npm is not working properly")
            return False
    except FileNotFoundError:
        print("  ❌ npm is not installed")
        return False
    
    return True

def install_greenfield_sdk():
    """Install Greenfield SDK"""
    print("🌱 Installing Greenfield SDK...")
    
    backend_dir = Path(__file__).parent
    
    # Check if package.json exists
    package_json = backend_dir / 'package.json'
    if not package_json.exists():
        print("  ❌ package.json not found")
        return False
    
    # Install npm dependencies
    os.chdir(backend_dir)
    return run_command('npm install', 'Installing npm dependencies')

def run_tests():
    """Run the integration tests"""
    print("🧪 Running integration tests...")
    
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Run pytest
    success = run_command('python -m pytest tests/test_greenfield_integration.py -s -v', 'Running Python tests')
    
    if success:
        print("\n🎉 Python tests completed successfully!")
    
    # Run Node.js test
    if Path('test_greenfield_standalone.js').exists():
        node_success = run_command('node test_greenfield_standalone.js', 'Running Node.js test')
        if node_success:
            print("\n🎉 Node.js test completed successfully!")
    
    return success

def main():
    """Main setup function"""
    print("🚀 Setting up BNB Greenfield integration tests...")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    success = True
    
    # Check Python requirements
    if not check_python_requirements():
        success = False
    
    print()
    
    # Check Node.js requirements
    if not check_node_requirements():
        print("⚠️  Node.js tests will be skipped")
    else:
        # Install Greenfield SDK
        if not install_greenfield_sdk():
            print("⚠️  Greenfield SDK installation failed")
    
    print()
    
    if success:
        print("✅ Setup completed successfully!")
        print("\nYou can now run tests with:")
        print("  pytest tests/test_greenfield_integration.py -s")
        print("  node test_greenfield_standalone.js")
        
        # Ask if user wants to run tests now
        response = input("\nRun tests now? (y/N): ").strip().lower()
        if response in ['y', 'yes']:
            print()
            run_tests()
    else:
        print("❌ Setup failed. Please resolve the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
