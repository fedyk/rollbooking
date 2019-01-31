
import { Date } from "../../../models/date";

interface Props {
  date: Date;
  resources: Array<{
    id: string;
    title: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    start: string; // iso, local
    end: string; // iso, local
    resourceId: string;
  }>;
  endpoints: {
    create: string;
    update: string;
    delete: string;
  }
}

export const calendar = ({ date, resources, events, endpoints }: Props) => `

<h5 class="h5 d-flex justify-content-between align-items-center">Calendar</h5>

<div id="calendar"></div>

<script>var __INITIAL_STATE__ = ${JSON.stringify({
  date,
  events,
  resources,
  endpoints
})}</script>
`
