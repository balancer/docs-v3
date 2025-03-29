import type { Plugin } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import { globby } from 'globby'

export const llmsTxtPlugin = (): Plugin => ({
  name: 'llms-txt-generator',
  
  // This hook runs after the site is generated
  onGenerated: async (app) => {
    console.log('Generating llms.txt file...')
    
    // Get the output directory path
    const outputDir = app.dir.dest()
    
    // Get the docs directory path (root level)
    const docsDir = app.dir.source()
    const glob = `${docsDir}/**/*.md`
    const files = await globby(glob);

    console.log('Files:', files)

    // Content for the file
    const llmsTxtContent = ['## Docs'];
    
    // Process each file to extract the first 10 lines
    for (const file of files) {
      try {
        // Read the file content
        const content = await fs.readFile(file, 'utf-8');
        
        // Split by lines and get the first 10
        const lines = content.split('\n').slice(0, 10);
        
        // Add file path as a header
        llmsTxtContent.push(`\n### ${file.replace(docsDir, '')}`);
        
        // Add the first 10 lines
        llmsTxtContent.push(lines.join('\n'));
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
    
    const llmsTxt = llmsTxtContent.join('\n')
    
    // Write the file
    await fs.writeFileSync(path.resolve(outputDir, 'llms.txt'), llmsTxt)
  },
}) 