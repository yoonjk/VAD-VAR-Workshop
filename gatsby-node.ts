import { createFilePath } from 'gatsby-source-filesystem';
import { GatsbyNode } from 'gatsby';

const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, getNode, actions }) => {
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
