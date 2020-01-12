import { User } from "../user";

/**
 * Interface for shared state
 * @see https://koajs.com/#ctx-state
 */
export interface State {
  title: string;
  scripts: string[];
  styles: string[];
  user?: User;
}
