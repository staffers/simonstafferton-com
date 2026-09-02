import { DateTime } from "luxon";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  // Decap's admin page is served as-is; Eleventy must not template it.
  eleventyConfig.ignores.add("src/admin/**");

  eleventyConfig.addFilter("displayDate", (d) =>
    DateTime.fromJSDate(d, { zone: "Europe/London" }).toFormat("d LLLL yyyy")
  );

  eleventyConfig.addFilter("isoDate", (d) =>
    DateTime.fromJSDate(d, { zone: "Europe/London" }).toISODate()
  );

  eleventyConfig.addFilter("year", (d) =>
    DateTime.fromJSDate(d, { zone: "Europe/London" }).toFormat("yyyy")
  );

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = String(content).replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").reverse()
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
