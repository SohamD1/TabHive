import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Function to copy files during build
function copyExtensionFilesPlugin() {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      // Ensure assets directory exists
      try {
        mkdirSync('dist/assets', { recursive: true });
      } catch (e) {
        console.log('Assets directory already exists');
      }

      // Copy manifest.json
      copyFileSync('src/manifest.json', 'dist/manifest.json');
      
      // Copy HTML file
      try {
        copyFileSync('index.html', 'dist/popup.html');
        console.log('HTML file copied successfully');
      } catch (e) {
        console.error('Error copying HTML file:', e);
      }
      
      // If there are assets in the assets directory, copy them
      try {
        if (existsSync('assets')) {
          // Copy tabhive.png (new logo)
          if (existsSync('assets/tabhive.png')) {
            copyFileSync('assets/tabhive.png', 'dist/assets/tabhive.png');
            console.log('Copied tabhive.png (new logo)');
          } else {
            console.warn('Warning: tabhive.png not found in assets directory');
          }
          
          // Copy original icons as fallback
          const icons = ['icon-16.png', 'icon-48.png', 'icon-128.png'];
          icons.forEach(icon => {
            if (existsSync(`assets/${icon}`)) {
              copyFileSync(`assets/${icon}`, `dist/assets/${icon}`);
              console.log(`Copied ${icon}`);
            } else {
              console.warn(`Warning: ${icon} not found in assets directory`);
            }
          });
        } else {
          console.warn('Assets directory not found. Extension might be missing icons.');
        }
      } catch (e) {
        console.warn('Warning: Error copying assets:', e);
      }
      
      console.log('Extension files copied successfully');
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    copyExtensionFilesPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.tsx'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    commonjsOptions: { 
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
      transformMixedEsModules: true
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
}) 