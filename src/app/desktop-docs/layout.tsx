import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { Metadata } from 'next'
import Link from 'next/link'
import './docs.css'
import ConditionalFloatingCodeEditor from '../../components/common/ConditionalFloatingCodeEditor';

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

  const navbar = (
    <Navbar
      logo={<span className="font-bold text-primary">VieVlog</span>}
      logoLink="/"
    >
      {/* Các link custom trên navbar */}
      <div className="flex space-x-4 ml-6">
        <Link href="/auth/sign-in" className="hover:text-primary">Login</Link>
      </div>
    </Navbar>
  )


  const excludePages = ['posts', 'auth', 'profile', 'games', 'image-editor', 'video-generator', 'korean', 'desktop-docs', 'docs']

  const filteredPageMap = pageMap.filter(
    (item: any) => !excludePages.includes(item.name.toLowerCase())
  )



  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="📚" />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>MIT {CURRENT_YEAR} © VieVlog.</Footer>}
          sidebar={{ autoCollapse: true, defaultOpen: false, toggleButton: false }}
          pageMap={filteredPageMap}
          feedback={{ content: null }}
          editLink={null}
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