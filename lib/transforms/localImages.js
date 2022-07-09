const path = require('path');
const fs = require('fs');
const glob = require('glob');

module.exports = (template, content, outputPath) => {
  // HUGO logic:
  // - if multiple *.md are in a folder (ignoring _index.html) - then no asset-copy over will occure
  // - if single index.html (allowing extra _index.html), then no further sub-dirs will be processed, all sub-dirs and files will be copied (except *.md)
  //
  // Alg:
  // - get all md/html/njk in the directory and sub-dirs, ignoring _index.* (_index.* - could be later used to create list-templates)
  // - if only 1 found = we copy the entire sub-content
  // - otherwise do no copy-over nothing
  if (template.inputPath.indexOf("posts") === -1) {
    return content;
  }
  console.warn(`TRANSFORM - input: ${template.inputPath}, output: ${outputPath}`);

  const outputDir = path.dirname(outputPath);
  const templateDir = path.dirname(template.inputPath).replace(/^\.\//, "");
  const templateFileName = path.basename(template.inputPath);

  const extensionsRegex = template._config.templateFormats.join(",");
  const mdSearchPattern = path.join(templateDir, `**/*.{${extensionsRegex}}`);
  const mdIgnorePattern = path.join(templateDir, `**/_index.{${extensionsRegex}}`);

  const entries = glob.sync(mdSearchPattern, { nodir: true, ignore: mdIgnorePattern });

  // only 1 page template allowed when copying assets
  if (entries.length > 1) {
    console.info(`Skipping copying over files from: ${templateDir} as multiple tempaltes found in directory!`);
    return;
  }

  // copy all hierarchically, except templates
  const fileSearchPattern = path.join(templateDir, `**/*`);
  const fileIgnorePattern = path.join(templateDir, `**/*.{${extensionsRegex}}`);

  const filesToCopy = glob.sync(fileSearchPattern, { nodir: true, ignore: fileIgnorePattern });

  for (let filePath of filesToCopy) {
    // strip template dir
    // prepend output dir
    const destPath = path.join(
      outputDir,
      filePath.substr(templateDir.length)
    );

    const destDir = path.dirname(destPath);

    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(filePath, destPath);
  }

  // keep original content
  return content;
};
