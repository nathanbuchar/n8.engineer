/**
 * Tickets plugin.
 *
 * @author Nate Meyer <hi@n8.engineer>
 * @module lib/plugins/tickets
*/

import Cache from '#lib/cache.js';
import { createDebug } from '#lib/utils/debug.js';

const debug = createDebug('plugins:tickets');

const ticketTailorEventsAPI = 'https://api.tickettailor.com/v1/events';
const ticketTailorToken = process.env.TICKET_TAILOR_TOKEN;
const ticketTailorTokenBase64 = Buffer.from(ticketTailorToken).toString('base64');

/** @returns {Plugin} */
function ticketsPlugin(opts) {
  const { enableCache = true } = opts;

  const cache = new Cache({
    key: 'tickets',
    enabled: enableCache,
  });

  const fetchEvents = async () => {
    const response = await fetch(ticketTailorEventsAPI, {
      headers: {
        Authorization: `Basic ${ticketTailorTokenBase64}`,
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();

    const events = data.filter((evt) => {
      const now = Date.now();

      // Filter out past events.
      if (now <= evt.end.unix * 1000) {
        return true;
      }

      // Filter out hidden and private events.
      if (evt.hidden === 'true' || evt.private === 'true') {
        return true;
      }

      return false;
    }).map((evt) => {
      const eventCopy = { ...evt };

      if (eventCopy.tickets_available_at) {
        const now = new Date();
        const onSaleDate = new Date(eventCopy.tickets_available_at.iso);

        if (now < onSaleDate) {
          eventCopy.tickets_available = 'upcoming';
        }
      }

      return eventCopy;
    }).sort((a, b) => {
      const aStart = new Date(a.start.iso);
      const bStart = new Date(b.start.iso);

      if (aStart < bStart) {
        return -1;
      } else if (aStart > bStart) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  return {
    async run(ctx) {
      debug('Fetching TicketTailor data…');

      const events = await cache.wrap(async () => await fetchEvents());

      // Add events to ctx.
      Object.assign(ctx, {
        events,
      });
    },
  };
}

export default ticketsPlugin;
