// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export const showAdminUI = process.env.NODE_ENV === "development";

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        published: fields.date({
          label: 'Published',
          description: 'The date the post was published',
          defaultValue: { kind: 'today' }
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/blog/cover-image'
        }),
        excerpt: fields.text({
          label: 'Excerpt'
        }),
        content: fields.markdoc({
          label: 'Content'
        }),
        authors: fields.array(
          fields.relationship({
            label: 'Authors',
            collection: 'authors',
            validation: {
              isRequired: true,
            },
          }),
          {
            label: 'Authors',
            itemLabel: (item) => item.value || 'Please select an author',
          }
        ),
      },
    }),
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/images/avatars'
        }),
      },
    }),
  },
});