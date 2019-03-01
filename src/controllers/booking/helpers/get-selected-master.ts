import { ObjectID } from "bson";

export function getSelectedMaster(masterId?: ObjectID): string {
  if (masterId) {
    return `${masterId}`;
  }

  return '';
}
