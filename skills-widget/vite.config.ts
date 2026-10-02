import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Builds the Skills section as a self-contained widget (JS + CSS) that the
// static portfolio site loads directly — no dev server / SSR involved, this
// project only exists to produce dist/skills-widget.{js,css}.
export default defineConfig({
  plugins: [react()],
  // This is a plain IIFE dropped into a non-bundler static page, so there's
  // no Node `process` global at runtime — some deps (react-dom, framer-motion)
  // still reference process.env.NODE_ENV internally, so inline it ourselves.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      formats: ['iife'],
      name: 'SkillsWidget',
      fileName: () => 'skills-widget.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.name && asset.name.endsWith('.css') ? 'skills-widget.css' : 'assets/[name][extname]',
      },
    },
  },
});
