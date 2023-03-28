import { createFilePath } from 'gatsby-source-filesystem';

const onCreateNode = ({ node, getNode, actions }: any) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath: './content',
      trailingSlash: false
    }).toLowerCase();

    const slugPath: string = relativeFilePath
      .split('/')
      .filter((s) => !!s && s !== 'readme')
      .join('/');

    createNodeField({
      node,
      name: 'slug',
      value: slugPath
    });
  }
};

export { onCreateNode };
