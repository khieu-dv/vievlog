import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import type { Metadata } from 'next'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type Props = {
  params: Promise<{ mdxPath?: string[] }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper || 'div'

export default async function Page(props: Props) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage(params.mdxPath)
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}