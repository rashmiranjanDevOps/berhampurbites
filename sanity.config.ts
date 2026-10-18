import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { colorInput } from '@sanity/color-input';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { schemaTypes } from './sanity/schemaTypes';
import { HomeIcon, DocumentTextIcon, ImagesIcon, PinIcon, PackageIcon, TagIcon, CogIcon, ColorWheelIcon, ThLargeIcon } from '@sanity/icons';
import { studioTheme } from './sanity/studio/theme';
import StudioLogo from './sanity/studio/StudioLogo';
import HomeTool from './sanity/studio/HomeTool';

// These exist exactly ONCE. Studio will not offer to create a second copy, nor to delete/duplicate/unpublish them —
// otherwise the website could silently pick the wrong one.
const singletons = ['homepage', 'story', 'businessSettings', 'brandSettings'];
const blockedSingletonActions = ['delete', 'unpublish', 'duplicate'];

export default defineConfig({
  name: 'default',
  title: 'Berhampur Bites',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  theme: studioTheme,
  studio: { components: { logo: StudioLogo } },
  // Landing screen = friendly Home (first tool is the default).
  tools: (prev) => [{ name: 'home', title: 'Home', icon: HomeIcon, component: HomeTool }, ...prev],
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Berhampur Bites Admin')
          .items([
            S.listItem().title('Website').child(
              S.list().title('Website').items([
                S.listItem().title('Homepage').icon(HomeIcon).child(S.document().schemaType('homepage').documentId('homepage')),
                S.listItem().title('Our Story').icon(DocumentTextIcon).child(S.document().schemaType('story').documentId('story')),
                orderableDocumentListDeskItem({ type: 'homeCircle', title: 'Homepage Circles (round pictures under the hero)', icon: ThLargeIcon, S, context }),
                orderableDocumentListDeskItem({ type: 'galleryItem', title: 'Gallery Photos', icon: ImagesIcon, S, context }),
                S.listItem().title('Our Outlets').icon(PinIcon).id('outlet').child(S.documentTypeList('outlet').title('Our Outlets')),
              ])
            ),
            S.listItem().title('Menu').child(
              S.list().title('Menu').items([
                orderableDocumentListDeskItem({ type: 'product', title: 'Products (food items)', icon: PackageIcon, S, context }),
                orderableDocumentListDeskItem({ type: 'category', title: 'Categories', icon: TagIcon, S, context }),
              ])
            ),
            S.divider(),
            S.listItem().title('Business Settings (phone, WhatsApp, links)').icon(CogIcon).child(S.document().schemaType('businessSettings').documentId('businessSettings')),
            S.listItem().title('Brand Settings (logo & colours)').icon(ColorWheelIcon).child(S.document().schemaType('brandSettings').documentId('brandSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletons.includes(item.getId() ?? '') && !['product', 'category', 'galleryItem', 'outlet', 'homeCircle'].includes(item.getId() ?? '')),
          ]),
    }),
    colorInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => !singletons.includes(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType) ? prev.filter(({ action }) => !action || !blockedSingletonActions.includes(action)) : prev,
  },
});
