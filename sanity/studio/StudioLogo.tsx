import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';

/** Shows the real logo from Brand Settings in the Studio's top-left corner. */
export default function StudioLogo(props: any) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    client.fetch(`*[_id == "brandSettings"][0].logo.asset->url`).then((u: string | null) => setUrl(u ? `${u}?h=64&auto=format` : null)).catch(() => {});
  }, [client]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {url && <img src={url} alt="" style={{ height: 28, width: 'auto', borderRadius: 4 }} />}
      <span style={{ fontWeight: 700 }}>{props.title || 'Berhampur Bites'} Admin</span>
    </div>
  );
}
