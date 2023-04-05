import { graphql, useStaticQuery } from 'gatsby';

interface MDXNode {
  fields: {
    slug: string;
  };
  frontmatter: {
    title: string;
  };
  tableOfContents: {
    items: {
      url: string;
      title: string;
    }[];
  };
}

interface SlugItem {
  slug: string;
  title: string;
}

export interface MenuItem {
  name: string;
  slug: string;
  root: string;
  children: MenuItem[];
}

// build site map tree
const buildSiteMap = () => {
  const {
    allMdx: { nodes }
  } = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
          }
          tableOfContents(maxDepth: 1)
        }
      }
    }
  `);

  const slugList: SlugItem[] = (nodes as MDXNode[])
    .map(({ fields, tableOfContents, frontmatter }) => ({
      slug: fields.slug,
      title:
        frontmatter?.title || (tableOfContents?.items && tableOfContents?.items[0]?.title) || ''
    }))
    .filter(({ slug }) => !!slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  // recursive insert pass by reference
  const insertNested = (array: MenuItem[], splitPath: string[], curr: SlugItem) => {
    let index = array.findIndex((item) => item.root === splitPath[0]);
    if (index < 0) {
      // insert in-place
      array.splice(array.length, 0, {
        name: curr.title,
        slug: `/${curr.slug}`,
        children: [],
        root: splitPath[0]
      });
      index = array.length;
    }

    splitPath.shift();
    if (splitPath.length > 0) insertNested(array[index].children, splitPath, curr);
  };

  return (
    slugList.reduce((acc, curr) => {
      const { slug } = curr;
      const splitSlug = slug.split('/').filter((s: string) => !!s);
      insertNested(acc, splitSlug, curr);
      return acc;
    }, []) as MenuItem[]
  ).sort((a, b) => a.children.length - b.children.length);
};

export default buildSiteMap;
