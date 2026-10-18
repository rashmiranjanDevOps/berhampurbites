import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';
import { Box, Button, Card, Flex, Grid, Heading, Stack, Text } from '@sanity/ui';
import { AddIcon, ImagesIcon, HomeIcon, CogIcon, DocumentTextIcon, LaunchIcon, CheckmarkCircleIcon, WarningOutlineIcon, PinIcon } from '@sanity/icons';

type Check = { label: string; ok: boolean; fix: { id: string; type: string }; hint: string };

/** Studio landing screen: big buttons, a "what's missing" checklist, and 3-step guides. */
export default function HomeTool() {
  const client = useClient({ apiVersion: '2024-01-01' });
  const router = useRouter();
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [counts, setCounts] = useState<{ products: number; categories: number; gallery: number; circles: number } | null>(null);
  const [outletId, setOutletId] = useState<string>('');

  useEffect(() => {
    client.fetch(`{
      "b": *[_id == "businessSettings"][0]{phone, whatsapp, contactReceiverNumber, email, address, googleMapsUrl, mapEmbedUrl, instagramUrl, facebookUrl, youtubeUrl},
      "outletId": *[_type == "outlet" && !(_id in path("drafts.**"))] | order(coalesce(isPrimary, false) desc, _createdAt asc)[0]._id,
      "circles": count(*[_type == "homeCircle" && !(_id in path("drafts.**"))]),
      "brand": *[_id == "brandSettings"][0]{"logo": defined(logo.asset)},
      "home": *[_id == "homepage"][0]{"hero": defined(heroImage.asset)},
      "outlet": count(*[_type == "outlet" && !(_id in path("drafts.**"))]),
      "products": count(*[_type == "product" && archived != true && !(_id in path("drafts.**"))]),
      "categories": count(*[_type == "category" && !(_id in path("drafts.**"))]),
      "gallery": count(*[_type == "galleryItem" && !(_id in path("drafts.**"))])
    }`).then((r: any) => {
      const bs = { id: 'businessSettings', type: 'businessSettings' };
      setChecks([
        { label: 'Logo uploaded', ok: !!r.brand?.logo, fix: { id: 'brandSettings', type: 'brandSettings' }, hint: 'Brand Settings → Logo' },
        { label: 'Homepage hero photo', ok: !!r.home?.hero, fix: { id: 'homepage', type: 'homepage' }, hint: 'Homepage → Hero Image' },
        { label: 'Phone number', ok: !!r.b?.phone, fix: bs, hint: 'Business Settings → Phone (shows Call buttons)' },
        { label: 'WhatsApp number', ok: !!r.b?.whatsapp, fix: bs, hint: 'Business Settings → WhatsApp (shows the green WhatsApp buttons)' },
        { label: 'Number that receives Contact-form messages', ok: !!(r.b?.contactReceiverNumber || r.b?.whatsapp || r.b?.phone), fix: bs, hint: 'Business Settings → Contact Form — Number that receives customer messages (or fill WhatsApp/Phone)' },
        { label: 'Email (shown in footer, optional)', ok: !!r.b?.email, fix: bs, hint: 'Business Settings → Email' },
        { label: 'Address', ok: !!r.b?.address, fix: bs, hint: 'Business Settings → Address (also draws the map)' },
        { label: 'Google Maps link', ok: !!r.b?.googleMapsUrl, fix: bs, hint: 'Business Settings → Google Maps URL (Get Directions button)' },
        { label: 'Map popup (Find Us / View Map)', ok: !!r.b?.mapEmbedUrl, fix: bs, hint: 'Business Settings → Google Maps embed (Share → Embed a map → Copy HTML)' },
        { label: 'Instagram link', ok: !!r.b?.instagramUrl, fix: bs, hint: 'Business Settings → Instagram URL (icon shows only when filled)' },
        { label: 'Facebook link', ok: !!r.b?.facebookUrl, fix: bs, hint: 'Business Settings → Facebook URL (icon shows only when filled)' },
        { label: 'YouTube link', ok: !!r.b?.youtubeUrl, fix: bs, hint: 'Business Settings → YouTube URL (icon shows only when filled)' },
        { label: 'At least one outlet', ok: r.outlet > 0, fix: { id: '', type: 'outlet' }, hint: 'Website → Our Outlets' },
      ]);
      setCounts({ products: r.products, categories: r.categories, gallery: r.gallery, circles: r.circles });
      setOutletId(r.outletId || '');
    }).catch(() => setChecks([]));
  }, [client]);

  const create = (type: string) => router.navigateIntent('create', { type });
  const edit = (id: string, type: string) => (id ? router.navigateIntent('edit', { id, type }) : create(type));
  const missing = (checks || []).filter((c) => !c.ok);

  const big = (icon: React.ReactNode, text: string, onClick: () => void, tone: any = 'default') =>
    <Button icon={icon} text={text} tone={tone} mode={tone === 'default' ? 'ghost' : 'default'} padding={4} fontSize={2} onClick={onClick} style={{ justifyContent: 'flex-start' }} />;

  return (
    <Box padding={[3, 4, 5]} style={{ maxWidth: 980, margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      <Stack space={5}>
        <Stack space={3}>
          <Heading as="h1" size={4}>Welcome 👋</Heading>
          <Text muted size={2}>Manage your website here. Changes you publish appear on the website within about a minute.</Text>
        </Stack>

        <Stack space={3}>
          <Text weight="semibold" size={2}>What would you like to do?</Text>
          <Grid columns={[1, 2, 3]} gap={3}>
            {big(<AddIcon />, 'Add a Product', () => create('product'), 'primary')}
            {big(<ImagesIcon />, 'Add a Gallery Photo', () => create('galleryItem'), 'primary')}
            {big(<AddIcon />, 'Add a Category', () => create('category'), 'primary')}
            {big(<AddIcon />, 'Add a Homepage Circle', () => create('homeCircle'), 'primary')}
            {big(<HomeIcon />, 'Edit Homepage', () => edit('homepage', 'homepage'))}
            {big(<DocumentTextIcon />, 'Edit Our Story', () => edit('story', 'story'))}
            {big(<PinIcon />, 'Our Outlet', () => edit(outletId, 'outlet'))}
            {big(<CogIcon />, 'Business Settings (phone, WhatsApp, links)', () => edit('businessSettings', 'businessSettings'))}
            {big(<CogIcon />, 'Brand Settings (logo & colours)', () => edit('brandSettings', 'brandSettings'))}
            <Button as="a" href="/" target="_blank" rel="noopener noreferrer" icon={<LaunchIcon />} text="View the Website" mode="ghost" padding={4} fontSize={2} style={{ justifyContent: 'flex-start' }} />
          </Grid>
        </Stack>

        {counts && (
          <Card padding={4} radius={3} shadow={1}>
            <Flex gap={5} wrap="wrap">
              <Text size={2}><strong>{counts.products}</strong> products</Text>
              <Text size={2}><strong>{counts.categories}</strong> categories</Text>
              <Text size={2}><strong>{counts.gallery}</strong> gallery photos</Text>
              <Text size={2}><strong>{counts.circles}</strong> homepage circles</Text>
            </Flex>
          </Card>
        )}

        <Stack space={3}>
          <Text weight="semibold" size={2}>Setup checklist {checks && <span style={{ fontWeight: 400 }}>— {missing.length === 0 ? 'everything is filled in 🎉' : `${missing.length} item${missing.length > 1 ? 's' : ''} still empty`}</span>}</Text>
          {checks === null && <Text muted size={1}>Checking…</Text>}
          {checks?.map((c) => (
            <Card key={c.label} padding={3} radius={2} border tone={c.ok ? 'positive' : 'caution'}>
              <Flex align="center" gap={3} justify="space-between" wrap="wrap">
                <Flex align="center" gap={3}>
                  <Text size={3}>{c.ok ? <CheckmarkCircleIcon /> : <WarningOutlineIcon />}</Text>
                  <Stack space={2}><Text size={2} weight="semibold">{c.label}</Text>{!c.ok && <Text size={1} muted>{c.hint}</Text>}</Stack>
                </Flex>
                {!c.ok && <Button text="Fix this" tone="primary" fontSize={1} padding={3} onClick={() => edit(c.fix.id, c.fix.type)} />}
              </Flex>
            </Card>
          ))}
        </Stack>

        <Stack space={3}>
          <Text weight="semibold" size={2}>Quick guides</Text>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>Add a product in 3 steps</Text>
            <Text size={1} muted>1) Click “Add a Product”. &nbsp; 2) Fill the name, category, price and upload a photo (best size 1200 × 900 px). &nbsp; 3) Click Publish. To show it on the homepage, turn on “Show on Homepage”.</Text>
          </Stack></Card>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>Edit the Signature Bite section</Text>
            <Text size={1} muted>Open Homepage → scroll to the “Signature Bite — …” fields. Pick the product, upload your own image (a transparent PNG floats on the yellow splash), and edit the heading, description, handwritten note and button. Leave any field empty to use the product’s own details.</Text>
          </Stack></Card>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>Control the round pictures under the hero</Text>
            <Text size={1} muted>Click “Add a Homepage Circle”, upload a picture (600 × 600), type its label, and choose which menu category it opens (or a custom link). Drag circles to reorder, switch “Show on website” off to hide one, or delete it. With no circles, your menu categories are shown instead.</Text>
          </Stack></Card>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>Handwritten note on the Signature Bite</Text>
            <Text size={1} muted>Homepage → “Signature Bite — Note …” fields: type the text, pick where it sits (above or below the picture; left, centre or right), and choose bold or normal and its size.</Text>
          </Stack></Card>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>How customer messages reach you</Text>
            <Text size={1} muted>On the Contact page, the customer taps “Send on WhatsApp” (or SMS) and their phone opens with your number and the message already typed. Set the number and wording in Business Settings → “Contact Form …”.</Text>
          </Stack></Card>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>Change the order of products, categories, circles or photos</Text>
            <Text size={1} muted>Open the list, then drag an item up or down using the handle on the left. No Publish needed — it saves by itself.</Text>
          </Stack></Card>
          <Card padding={4} radius={3} border><Stack space={3}>
            <Text weight="semibold" size={2}>Hide something without deleting it</Text>
            <Text size={1} muted>For a product, turn on “Archived” (or turn “Available” off to show “Currently Unavailable”). For a gallery photo, turn “Enabled” off.</Text>
          </Stack></Card>
        </Stack>
      </Stack>
    </Box>
  );
}
