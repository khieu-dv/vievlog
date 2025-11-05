import { Footer, Layout, Navbar } from 'nextra-theme-docs'
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


  const excludePages = ['posts', 'auth', 'profile', 'games', 'image-editor', 'video-generator', 'korean', 'desktop-docs', 'docs']

  const filteredPageMap = pageMap.filter(
    (item: any) => !excludePages.includes(item.name.toLowerCase())
  )



  return (
    <>
      <Layout
        navbar={null}
        footer={null}
        sidebar={{ autoCollapse: true, defaultOpen: false, toggleButton: false }}
        pageMap={filteredPageMap}
        feedback={{ content: null }}
        editLink={null}
        navigation={{
          prev: false,
          next: false
        }}
      >
        <div data-pagefind-body>
          {children}
        </div>
      </Layout>
    </>
  )
}