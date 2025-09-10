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
      logo={<span className="font-bold text-primary">VieVlog</span>}
      logoLink="/"
    >
      {/* Các link custom trên navbar */}
      <div className="flex space-x-4 ml-6">
        <Link href="/docs" className="hover:text-primary">Docs</Link>
        <Link href="/auth/sign-in" className="hover:text-primary">Login</Link>
      </div>
    </Navbar>
  )


  const excludePages = ['posts', 'auth', 'profile', 'games', 'image', 'video']

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
          sidebar={{ defaultMenuCollapseLevel: 1 }}
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