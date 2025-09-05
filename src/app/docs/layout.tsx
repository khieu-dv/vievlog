import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { Metadata } from 'next'
import './docs.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://vievlog.com'),
  title: {
    template: '%s - VieVlog Docs',
    default: 'VieVlog Documentation'
  },
  description: 'VieVlog Documentation with Nextra',
  applicationName: 'VieVlog Docs'
}

interface DocsLayoutProps {
  children: React.ReactNode
}

const CURRENT_YEAR = new Date().getFullYear()

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const pageMap = await getPageMap()
  
  const navbar = (
    <Navbar
      logo={
        <div className="flex items-center space-x-2">
          <span className="font-bold text-primary">VieVlog</span>
          <span className="text-muted-foreground opacity-60">Documentation</span>
        </div>
      }
    />
  )

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="📚" />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>MIT {CURRENT_YEAR} © VieVlog.</Footer>}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}