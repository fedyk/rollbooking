
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

<div class="card">
  <div class="card-body">
    <div id="calendar">
      <div class="d-flex justify-content-center m-5">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script>var __INITIAL_STATE__ = ${JSON.stringify({
  date,
  events,
  resources,
  endpoints
})}</script>
`
