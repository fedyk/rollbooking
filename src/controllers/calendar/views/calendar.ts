
import { Date } from "../../../models/date";

interface Props {
  date: Date;
  masters: Array<{
    id: string;
    name: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    start: string; // iso, local
    end: string; // iso, local
    masterId: string;
  }>;
  clients: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
  }>;
  services: Array<{
    id: number;
    name: string;
    duration: number;
  }>;
  endpoints: {
    base: string;
    list: string;
    create: string;
    update: string;
    delete: string;
    createClient: string;
    suggestClients: string;
  };
}

export const calendar = (props) => `

<div id="calendar">
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</div>
  
<script>var __INITIAL_STATE__ = ${JSON.stringify(props)}</script>
`
