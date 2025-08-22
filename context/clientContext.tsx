import { createContext } from "react";
import { Agent } from "stanza";
import { RosterResult } from "stanza/protocol";

interface ClientContextType {
  client: Agent | null;
  roster: RosterResult;
  setClient: (c: Agent | null) => void;
  setRoster: (roster: RosterResult) => void;
}

export const ClientContext = createContext<ClientContextType>({
  client: null,
  setClient: () => {},
  roster: { items: [] },
  setRoster: () => {},
});
