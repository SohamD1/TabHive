# TabHive Website Setup Script
Write-Host "Setting up TabHive Website..." -ForegroundColor Yellow

# Create src directory if it doesn't exist
if (-not (Test-Path -Path "src")) {
    New-Item -ItemType Directory -Path "src" | Out-Null
    Write-Host "Created src directory" -ForegroundColor Green
}

# Create src/components directory if it doesn't exist
if (-not (Test-Path -Path "src/components")) {
    New-Item -ItemType Directory -Path "src/components" | Out-Null
    Write-Host "Created src/components directory" -ForegroundColor Green
}

# Copy src files
Write-Host "Copying source files..." -ForegroundColor Yellow
Copy-Item -Path "temp/src/*.tsx" -Destination "src/" -Force
Copy-Item -Path "temp/src/*.ts" -Destination "src/" -Force
Copy-Item -Path "temp/src/*.css" -Destination "src/" -Force
Copy-Item -Path "temp/src/components/*.tsx" -Destination "src/components/" -Force

# Copy public files
Write-Host "Copying public files..." -ForegroundColor Yellow
if (-not (Test-Path -Path "public")) {
    New-Item -ItemType Directory -Path "public" | Out-Null
}
Copy-Item -Path "temp/public/*" -Destination "public/" -Force -Recurse

# Copy other important files
Write-Host "Copying configuration files..." -ForegroundColor Yellow
Copy-Item -Path "temp/tsconfig.json" -Destination "./" -Force

Write-Host "Setup complete! You can now run: npm start" -ForegroundColor Green 