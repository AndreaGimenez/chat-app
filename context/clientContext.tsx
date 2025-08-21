import { createContext } from "react";
import { Agent } from "stanza";

interface ClientContextType {
  client: Agent | null;
  setClient: (c: Agent | null) => void;
}

export const ClientContext = createContext<ClientContextType>({
  client: null,
  setClient: () => {},
});
