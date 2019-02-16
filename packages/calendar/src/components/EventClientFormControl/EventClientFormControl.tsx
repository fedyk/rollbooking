import * as React from "react";
import * as ReactAutocomplete from "react-autocomplete";
import { Event, Client } from "../../types";
import {
  CalendarContext,
  ContextValue
} from "../CalendarContext/CalendarContext";
import { find } from "../../helpers/find";

// Hotfix: test would not work without this(problem in diff in solving package by rollup or jest)
const Autocomplete = (ReactAutocomplete as any).default || ReactAutocomplete;

const ADD_NEW_CLIENT = "ADD_NEW_CLIENT";

interface Props {
  event: Event;
  clients: Client[];
  onUpdate(event: Event): void;
}

interface State {
  eventId: string;
  clientName: string;
  clients: Client[];
}

export class CalendarEventClient extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.event.id !== state.eventId) {
      return {
        eventId: props.event.id,
        clientName: props.event.clientName,
        clients: props.clients || []
      };
    }

    return null;
  }

  context: ContextValue;

  constructor(props: Props) {
    super(props);

    this.state = {
      eventId: props.event.id,
      clientName: props.event.clientName,
      clients: props.clients || []
    };
  }

  onChangeClient = async (e, clientName: string) => {
    this.setState({ clientName });

    const clients = await this.context.suggestClients(clientName);

    if (clientName.length > 2) {
      clients.unshift({
        id: ADD_NEW_CLIENT,
        name: `Add "${clientName}"`
      } as Client);
    }

    this.setState({ clients });
  };

  onSelectClient = async (clientId) => {
    let client: Client;

    // Quick create and add client
    if (clientId === ADD_NEW_CLIENT) {
      client = await this.context.createClient(this.state.clientName);
    } else {
      client = find(this.state.clients, (v) => v.id === clientId);
    }

    if (!client) {
      throw new Error("Client does not exist on the list");
    }

    this.setState({ clientName: client.name });
    this.props.onUpdate({
      ...this.props.event,
      ...{
        clientId: client.id,
        clientName: client.name
      }
    });
  };

  render() {
    return (
      <Autocomplete
        value={this.state.clientName}
        onChange={this.onChangeClient}
        onSelect={this.onSelectClient}
        autoHighlight={false}
        wrapperStyle={{
          display: "block"
        }}
        inputProps={{
          className: "form-control"
        }}
        getItemValue={(item) => item.id}
        items={this.state.clients}
        renderMenu={(items, value, style) => (
          <div
            className="list-group"
            style={{ ...style, position: "fixed", zIndex: 1 }}
            children={items}
          />
        )}
        renderItem={(item, isHighlighted) => (
          <button
            key={item.id}
            type="button"
            className={`list-group-item list-group-item-action ${
              isHighlighted ? "active" : ""
            }`}
          >
            {item.name}
            {(item.email || item.phone) && (
              <React.Fragment>
                <br />
                <span className="text-secondary">
                  {[item.email, item.phone].join(",")}
                </span>
              </React.Fragment>
            )}
          </button>
        )}
      />
    );
  }
}

CalendarEventClient.contextType = CalendarContext;
