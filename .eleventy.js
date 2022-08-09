const pluginTailwind = require('eleventy-plugin-tailwindcss');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const mila = require('markdown-it-link-attributes');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const localImages = require('./lib/transforms/localImages');

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

  config.setFrontMatterParsingOptions({
    excerpt: true
  })

  config.setLibrary("md", markdownLib);

  config.addPlugin(pluginTailwind, {
    src: 'src/assets/css/*'
  });

  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/**/*');
  config.addPassthroughCopy('src/posts/**/*.webp');
  config.addPassthroughCopy({ 'src/posts/img/**/*': 'assets/img/' });
  config.addPassthroughCopy('src/.htaccess');

  config.addWatchTarget("src/assets/js/");

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  config.addFilter('minifyJs', require('./lib/filters/minifyJs'));
  config.addFilter('toHTML', str => new markdownIt(markdownItOptions).renderInline(str));

  config.addTransform('minifyHtml', require('./lib/transforms/minifyHtml'));
  config.addTransform('local-images', function(content, outputPath) {
    return localImages(this, content, outputPath);
  })

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('tagList', require('./lib/collections/tagList'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));
  config.addCollection('pagedPostsByTag', require('./lib/collections/pagedPostsByTag'));

  config.addPlugin(syntaxHighlight);
  config.addPlugin(pluginRss);

  config.addNunjucksFilter("titleImage", (value, post) => {
    if (value.startsWith("/") || value.startsWith("https://")) {
      return value;
    }
    return `${post.url}/${value}`;
  });
  config.addNunjucksShortcode("today", function() {
    return new Date(Date.now()).toISOString().slice(0, 10);
  });

  config.addWatchTarget("src/posts/**");

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    // pathPrefix: "/subfolder/",
    templateFormats: [
      'md',
      'njk',
      'html',
    ],
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
