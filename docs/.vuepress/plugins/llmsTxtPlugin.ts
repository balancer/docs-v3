import type { Plugin } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import { globby } from 'globby'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import { visit } from 'unist-util-visit'
import { toMarkdown } from 'mdast-util-to-markdown'
import type { Heading } from 'mdast'
import { directiveToMarkdown } from 'mdast-util-directive'
import remarkDirective from 'remark-directive'
import { gfmToMarkdown } from 'mdast-util-gfm'

export const llmsTxtPlugin = (): Plugin => ({
  name: 'llms-txt-generator',

  onGenerated: async (app) => {

    const outDir = app.dir.dest()

    const content = [`# Balancer V3`, '']
    content.push(`> Learn, integrate, and build on a programmable AMM`, '')

    const docsDir = app.dir.source()
    const glob = `${docsDir}/**/*.md`
    const files = await globby(glob);

    const llmsTxtContent = [...content, '## Docs', ''];
    const llmsFullTxtContent = content;

    for (const file of files) {
      try {
        let path = file.replace(docsDir, '').replace(/\.[^.]*$/, '')
        if (path.endsWith('index')) path = path.replace('index', '').replace(/\/$/, '')

        if (!path) continue

        const contents = await fs.readFile(file, 'utf-8');
        const parser = unified().use(remarkParse).use(remarkFrontmatter).use(remarkDirective).use(remarkStringify)

        // Abstract syntax tree from the contents of all the markdown files
        const ast = parser.parse(contents)

        // To create like "- [Celo](/docs/chains/celo): Integrating with Celo in Viem"
        visit(ast, { type: 'heading', depth: 1 }, (n, i) => {
          const node = n.children[0]
          if (node.type !== 'text') return

          const value = node.value
          const [, title, subTitle] = value.match(/^([^\[\]]+)(?: \[([^\[\]]+)\])?$/) ?? []

          // Look for a description: either use subtitle or first paragraph after heading
          let found = false
          let description = subTitle
          if (!description)
            visit(ast, { type: 'paragraph' }, (n, j) => {
              if (found) return                    
              if (j && i && j <= i) return         
              
              found = true
              const text = toMarkdown(n, {
                extensions: [
                  directiveToMarkdown(),
                  gfmToMarkdown(),
                ],
              }).trim()
              
              // Remove the directive markers but keep the content
              description = text.replace(/:::\w+\s*/, '').replace(/:::$/, '').trim()
              return
            })

          llmsTxtContent.push(
            `- [${title}](${path})${description ? `: ${description}` : ''}`
          )
        })

        // Adjust depth of headings to conform to /llms.txt standard
        visit(
          ast,
          (n) => n.type === 'heading',
          (n) => {
            const node = n as Heading
            if (node.depth === 1 || node.depth === 2 || node.depth === 3 || node.depth === 4)
              node.depth = (node.depth + 1) as 2 | 3 | 4 | 5
          },
        )

        // remove frontmatter
        visit(ast, { type: 'yaml' }, (_, i, p) => {
          if (!p) return
          if (typeof i !== 'number') return
          p.children.splice(i, 1)
        })


        llmsFullTxtContent.push(
          toMarkdown(ast, {
            extensions: [
              directiveToMarkdown(),
              gfmToMarkdown(),
            ],
          }),
          '',
        )

      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    const llmsTxt = llmsTxtContent.join('\n')
    const llmsFullTxt = llmsFullTxtContent.join('\n')

    fs.ensureDirSync(outDir)
    fs.writeFileSync(path.resolve(outDir, 'llms.txt'), llmsTxt)
    fs.writeFileSync(path.resolve(outDir, 'llms-full.txt'), llmsFullTxt)
  },
}) 