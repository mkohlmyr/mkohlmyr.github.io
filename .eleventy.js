import markdownIt from "markdown-it";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

// Token-level plugin to increment heading levels for articles
function incrementHeadingsPlugin(md) {
  md.core.ruler.after('block', 'increment-headings', function(state) {
    // Access template data from Eleventy's context
    // Eleventy stores template data in state.env
    const templateData = state.env || {};
    const layout = templateData.layout;
    
    // Fallback: check if file path matches article pattern (src/20**/**/*.md)
    // This is a backup in case layout isn't available in state.env
    const filePath = templateData.page?.inputPath || '';
    const isArticlePath = /src\/20\d{2}\//.test(filePath);
    
    // Only increment headings for articles (check layout first, then path)
    if (layout === "article" || isArticlePath) {
      state.tokens.forEach(token => {
        if (token.type === 'heading_open') {
          const level = parseInt(token.tag.charAt(1));
          if (level >= 1 && level <= 5) {
            token.tag = `h${level + 1}`;
          }
        }
      });
    }
  });
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("src/assets");

  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  };

  const md = markdownIt(markdownItOptions);
  md.use(incrementHeadingsPlugin);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addCollection("experience", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/experience/**.md").sort((a, b) => {
      return new Date(b.data.from).getTime() - new Date(a.data.from).getTime();
    })
  });

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/20**/**/*.md")
      .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
  });

  eleventyConfig.addFilter("formatDate", (dt) => {
    return new Date(dt.toString()).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  });

  return {
    emptyOutputDir: true,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    }
  }
}