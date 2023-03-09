const path = require('path');

const pluginTailwind = require('eleventy-plugin-tailwindcss');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const mila = require('markdown-it-link-attributes');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const localImages = require('./lib/transforms/localImages');
const Image = require("@11ty/eleventy-img");

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

async function imageShortCode(src, paths, alt, imageClass, sizes) {
  if (src) {
    src = `${paths.srcDir}/${src}`;
  } else {
    src = './src/assets/img/no-image.svg';
  }
  let metadata = await Image(src, {
    widths: ["auto", 2048, 1536, 1024, 768, 512, 384, 256],
    formats: ["avif", "webp", "jpeg"],
    urlPath: paths.url,
    outputDir: paths.outputDir,
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes || "100vw"}">`;
  }).join("\n")}
      <img
        class="${imageClass || ""}"
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        alt="${alt}"
        decoding="async">
    </picture>`;
}


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
    if (!value.startsWith("/") && !value.startsWith("https://")) {
      value = `/${post.url}/${value}`;
    }
    return value;
  });
  config.addAsyncShortcode("postTitleImage", async (thumb, thumbAlt, page, imageClass, sizes) => {
    return imageShortCode(thumb, {
      srcDir: path.dirname(page.inputPath),
      url: page.url,
      outputDir: path.dirname(page.outputPath),
    }, thumbAlt, imageClass, sizes)
  });
  config.addAsyncShortcode("gridTitleImage", async (post, imageClass, sizes) => {
    return imageShortCode(post.data.thumb, {
      srcDir: path.dirname(post.inputPath),
      url: post.url,
      outputDir: path.dirname(post.outputPath),
    }, post.data.thumbAlt, imageClass, sizes)
  });

  config.addNunjucksShortcode("today", function() {
    return new Date(Date.now()).toISOString().slice(0, 10);
  });

  config.addNunjucksShortcode("github_gist", function(id) {
    return `<script src="https://gist.github.com/${id}.js"></script>`;
  })

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
