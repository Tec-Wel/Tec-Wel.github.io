---
sidebar_position: 2
---

# Create a Document

Documents are **groups of pages** connected through:

- a **sidebar**
- **previous/next navigation**
- **versioning**

## Create your first Doc

Create a Markdown file at `docs/hello.md`:

```md title="docs/hello.md"
# Hello

This is my **first Docusaurus document**!
```

A new document is now available at [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello).

## Add your document to docs sidebar

You can add your document to the sidebar by itself or under a category. Check the [docs](https://docusaurus.io/docs/sidebar/items) for more information of different types.

```ts title="sidebars.ts"
const sidebars: SidebarsConfig = {
  docsSidebar: [
    // By itself
    {
      type: "doc",
      id: "name-of-doc-file",
      label: "Title of doc",
    },

    // Or under a category,
    {
      type: "category",
      label: "Name of dropdown",
      items: ["name-of-doc-file"],
    },
  ],
};

export default sidebars;
```
