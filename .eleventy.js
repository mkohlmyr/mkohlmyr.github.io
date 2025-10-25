import markdownIt from "markdown-it";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";


export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy("src/assets");

  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  };

  eleventyConfig.setLibrary("md", markdownIt(markdownItOptions));

  eleventyConfig.addCollection("experience", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/experience/**.md").sort((a, b) => {
      return new Date(b.data.from).getTime() - new Date(a.data.from).getTime();
    })
  })

  eleventyConfig.addGlobalData("copyrightYear", () => {
    return new Date().getFullYear();
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