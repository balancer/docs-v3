import type { SidebarConfig } from '@vuepress/theme-default';
import glob from 'glob';
import { join, normalize, sep, basename } from 'path';
import { lstatSync, readFileSync, readdirSync, existsSync } from 'fs';
import sortBy from 'lodash/sortBy.js';
import titleize from 'titleize';
import markdownIt from 'markdown-it';
import meta from 'markdown-it-meta';

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).filter(
    name => !(name === '.vuepress') && isDirectory(join(source, name))
  );

const getName = (path: string) => {
  const name = path.split(sep).pop();
  if (!name) return;
  if (name === 'veBAL') return name;
  return titleize(name.replace(/-/g, ' '));
};

const getChildren = (parent_path, dir, recursive = true) => {
  parent_path = normalize(parent_path);
  parent_path = parent_path.endsWith(sep)
    ? parent_path.slice(0, -1)
    : parent_path; // Remove last / if exists.
  const pattern = recursive ? '/**/*.md' : '/*.md';
  const files = glob
    .sync(parent_path + (dir ? `/${dir}` : '') + pattern)
    .map(path => {
      // Instantiate MarkdownIt
      const md = new markdownIt();
      // Add markdown-it-meta
      md.use(meta);
      // Get the order value
      const file = readFileSync(path, 'utf8');
      md.render(file);

      const order = md.meta.order;
      // Remove "parent_path" and ".md"
      path = path.slice(4, -3);
      // Remove "README", making it the de facto index page
      if (basename(path.toLowerCase()) === 'readme') {
        if (dir == '') return;
        path = path.slice(0, -6);
      }

      return {
        path,
        order: path === '' && order === undefined ? 0 : order, // README is first if it hasn't order
      };
    })
    .filter(obj => obj !== undefined);

  // Return the ordered list of files, sort by 'order' then 'path'
  return sortBy(files, ['order', 'path']).map(file => file.path);
};

/**
 * Return sidebar config for given baseDir.
 *
 * @param   {String} baseDir        - Absolute path of directory to get sidebar config for.
 * @param   {Object} options        - Options
 * @param   {String} relativeDir    - Relative directory to add to baseDir
 * @param   {Number} currentLevel   - Current level of items.
 * @returns {Array.<String|Object>} - Recursion level
 */
const side = (baseDir, relativeDir = '', currentLevel = 1) => {
  const directories = getDirectories(join(baseDir, relativeDir));

  // If we only have one sub directory the full sidebar should always be shown
  const collapsible =
    currentLevel === 1 && directories.length === 1 ? false : true;

  const fileLinks = getChildren(baseDir, relativeDir, currentLevel > 2);
  if (currentLevel <= 2) {
    directories.forEach(subDir => {
      const children = side(
        baseDir,
        join(relativeDir, subDir),
        currentLevel + 1
      );

      let insertPosition = directories.length + fileLinks.length;

      if (children.length > 0) {
        const orderPath = join(baseDir, relativeDir, subDir, '.order');
        if (existsSync(orderPath)) {
          const file = readFileSync(orderPath, 'utf8');
          insertPosition = Number(file);
        }

        fileLinks.splice(insertPosition, 0, {
          text: getName(subDir),
          order: insertPosition,
          collapsible,
          children,
        });
      }
    });
  }

  if (currentLevel === 2) {
    return fileLinks;
  } else {
    return sortBy(fileLinks, ['order']);
  }
};

// export const sidebar = getConfig('./', {});
export const sidebar: SidebarConfig = {
  '/build': side('docs/build/', ''),
  '/concepts': side('docs/concepts/', ''),
  '/partner-onboarding': side('docs/partner-onboarding/', ''),
  '/data-and-analytics': side('docs/data-and-analytics/', ''),
  '/integration-guides': side('docs/integration-guides/', ''),
  '/tools': side('docs/tools/', ''),
  '/developer-reference/': side('docs/developer-reference/', ''),
  // '/': side('docs/', ''),
};
