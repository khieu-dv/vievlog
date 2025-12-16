import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../../mdx-components'
import CommentSection from '../../../components/docs/comment-section'
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

  // Create doc path from mdxPath params
  const docPath = params.mdxPath?.join('/') || 'index'

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
      <CommentSection docPath={docPath} />
    </Wrapper>)
}