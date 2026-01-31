import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LPDB Client',
  description: 'Type-safe TypeScript client for Liquipedia API v3',
  base: '/lpdb-ts-client/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/client' },
      {
        text: 'Links',
        items: [
          { text: 'GitHub', link: 'https://github.com/npldevfr/lpdb-ts-client' },
          { text: 'Liquipedia API Docs', link: 'https://api.liquipedia.net/documentation/api/v3' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' }
          ]
        },
        {
          text: 'Usage',
          items: [
            { text: 'Basic Queries', link: '/guide/basic-queries' },
            { text: 'Endpoints', link: '/guide/endpoints' },
            { text: 'Error Handling', link: '/guide/error-handling' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'LPDBClient', link: '/api/client' },
            { text: 'QueryBuilder', link: '/api/query-builder' },
            { text: 'Types', link: '/api/types' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/npldevfr/lpdb-ts-client' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 npldevfr'
    },
    search: {
      provider: 'local'
    }
  }
})
