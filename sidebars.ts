import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "Introduction",
    },
    {
      type: "category",
      label: "Mobile Application",
      items: ["mobile/intro", "mobile/auth"],
    },
  ],
  tutorialSidebar: [
    {
      type: "doc",
      label: "Creating a Doc",
      id: "tutorial-basics/create-a-document",
    },
    {
      type: "doc",
      label: "Markdown Features",
      id: "tutorial-basics/markdown-features",
    },
  ],
};

export default sidebars;
