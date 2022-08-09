module.exports = {
  layout: 'post',
  title: 'Untitled',
  eleventyComputed: {
    permalink: (data) => `${data.page.date.toISOString().slice(0, 10)}_${data.page.fileSlug}/index.html`,
  }
};
