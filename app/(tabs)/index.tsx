import React from 'react';
import { EventFeed } from '../../src/screens/EventFeed';

export default function MeetsScreen() {
  return (
    <EventFeed
      kind="meet"
      brand
      title="Meets"
      subtitle="Turn-up gatherings across the UK"
      noun="meet"
      searchPlaceholder="Search meets, venues, towns"
    />
  );
}
