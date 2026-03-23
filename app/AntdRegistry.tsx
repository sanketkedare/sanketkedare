'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';

interface AntdRegistryProps {
  children: React.ReactNode;
}

export default function AntdRegistry({ children }: AntdRegistryProps) {
  const [cache] = useState(() => createCache());

  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
