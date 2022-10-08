import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

import { version } from './package.json'
const banner = `/*\nStimulusPhotoSwipe ${version}\n*/`

export default [
  {
    external: ['@hotwired/stimulus', 'photoswipe'],
    input: 'src/index.ts',
    output: [
      {
        name: 'StimulusPhotoSwipe',
        file: 'dist/index.umd.js',
        format: 'umd',
        banner,
        globals: {
          '@hotwired/stimulus': 'Stimulus',
          photoswipe: 'PhotoSwipe'
        }
      },
      {
        file: 'dist/index.js',
        format: 'es',
        banner
      }
    ],
    plugins: [resolve(), typescript()],
    watch: {
      include: 'src/**'
    }
  }
]
