import { Footer, Layout } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { Metadata } from 'next'
import Link from 'next/link'
import './docs.css'
import ConditionalFloatingCodeEditor from '../../components/common/ConditionalFloatingCodeEditor';
import { CustomNavbar } from '../../components/common/CustomNavbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://vievlog.com'),
  title: {
    template: '%s - VieVlog Desktop Docs',
    default: 'VieVlog Desktop Documentation'
  },
  description: 'VieVlog Desktop Documentation with Nextra',
  applicationName: 'VieVlog Desktop Docs'
}

interface DocsLayoutProps {
  children: React.ReactNode
}

const CURRENT_YEAR = new Date().getFullYear()

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const pageMap = await getPageMap()

  const excludePages = ['posts', 'auth', 'profile', 'games', 'image-editor', 'video-generator', 'korean', 'desktop-docs', 'docs', 'mobile-docs']

  const filteredPageMap = pageMap.filter(
    (item: any) => !excludePages.includes(item.name.toLowerCase())
  )

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="📚" />
      <body>
        <Layout
          navbar={<CustomNavbar />}
          footer={<Footer>MIT {CURRENT_YEAR} © VieVlog.</Footer>}
          sidebar={{ autoCollapse: true, defaultOpen: false, toggleButton: false }}
          pageMap={filteredPageMap}
          feedback={{ content: null }}
          editLink={null}
          navigation={{
            prev: true,
            next: true
          }}
        >
          <div data-pagefind-body>
            {children}
          </div>
        </Layout>
        <ConditionalFloatingCodeEditor />
      </body>
    </html>
  )
}