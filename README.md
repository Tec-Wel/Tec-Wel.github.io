# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
> npm install
```

### Local Development

```
> npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

It is always recommended to test your build locally to make sure it is still working. You can do this by,

```
npm run serve
```

### Development

You are now ready to start creating new documents. Your first step is looking inside the ./docs folder where ALL the documents are stored.

> [!NOTE]
> Every document is using either a regular markdown file (.md) or a superset with javascript code (.mdx)

Create or edit a file inside the ./docs folder to start creating new docs. For an in-depth tutorial on how to create a good-looking doc, read [this guide](https://docusaurus.io/docs/markdown-features) for more information.

To see your new document on the website, add its location inside ./sidebars.ts
```ts
const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "Introduction",
    },
    {
      type: "category",
      label: "Mobile Application", // <-- Make sure to put it under the right category, this one holds all the mobile docs
      items: ["mobile/installation", "mobile/intro", "mobile/auth"], // <-- Here if its under a "folder"
    },
    {
        type: "doc",
        id: "NEW_DOCUMENT_FILE_NAME", // <-- Here if its under no "categories"
        label: "New Doc!"
    },
    //... other categories
  ],
}
```

Then you can see your new document!

### Pushing changes

Once you have added your new doc inside ./docs, and added its location inside ./sidebars.ts. You are ready to update the new changes on the official website.
We already have a CI/CD pipeline set up, so you do not have to worry about deployment, all you need to do is push your changes to main and the deployment will update automatically.

```bash
git add .
git status
git commit -m "Created new docs!"
git push origin main
```

If you have large changes, it is recommended to create a new branch with your changes and then do a pull request
```bash
git checkout -b new-branch-name
git add .
git status
git commit -m "Created new docs on branch!"
git push origin new-branch-name
```

And then do the PR on github. Again, the CI jobs will run when any changes happen on main, including pull requests.