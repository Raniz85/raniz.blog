const pluginTailwind = require('eleventy-plugin-tailwindcss');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const mila = require("markdown-it-link-attributes");

const markdownItOptions = {
  html: true
};
const milaOptions = {
  pattern: /^(?!(https:\/\/raniz\.blog|#)).*$/gm,
  attrs: {
    target: "_blank",
    rel: "noopener noreferrer"
  }
};
const markdownLib = markdownIt(markdownItOptions).use(mila, milaOptions);

module.exports = (config) => {

  config.setLibrary("md", markdownLib);

  config.addPlugin(pluginTailwind, {
    src: 'src/assets/css/*'
  });

  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/**/*');
  config.addPassthroughCopy({ 'src/posts/img/**/*': 'assets/img/' });
  config.addPassthroughCopy('src/.htaccess');

  config.addWatchTarget("src/assets/js/");

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));

  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('tagList', require('./lib/collections/tagList'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));
  config.addCollection('pagedPostsByTag', require('./lib/collections/pagedPostsByTag'));

  config.addPlugin(syntaxHighlight);

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    // pathPrefix: "/subfolder/",
    templateFormats: ['md', 'njk', 'html'],
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
