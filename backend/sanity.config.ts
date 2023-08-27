import {defineConfig} from 'sanity'
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'reddit-clone',

  projectId: 'ivi3nrzf',
  dataset: 'production',

  plugins: [deskTool(), visionTool(), vercelDeployTool()],

  schema: {
    types: schemaTypes,
  },
})
