import React from 'react';
import { EventFeed } from '../../src/screens/EventFeed';

export default function EventsScreen() {
  return (
    <EventFeed
      kind="event"
      title="Events"
      subtitle="Shows, track days and ticketed occasions"
      noun="event"
      searchPlaceholder="Search events, circuits, shows"
    />
  );
}
