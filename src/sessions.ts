import { Db } from "mongodb";

export function getSessionConfig(db: Db) {
  const sessions = db.collection("sessions")

  /** https://github.com/koajs/session#example */
  return {
    key: 'sid',
    maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // 5y
    autoCommit: true,
    overwrite: true,
    httpOnly: false,
    signed: true,
    rolling: true,
    renew: true,
    store: {
      get,
      set,
      destroy
    }
  }

  function get(key, maxAge) {
    return sessions
      .findOne({ key })
      .then(result => result ? result.payload : null)
      .catch(err => console.warn("session#get", err.message))
  }

  function set(key: string, payload, maxAge) {
    const filter = {
      key
    }

    const update = {
      $set: {
        key,
        maxAge,
        payload,
        updatedAt: new Date
      }
    }

    const options = {
      upsert: true
    }
 
    return sessions
      .findOneAndUpdate(filter, update, options)
      .catch(err => console.warn("session#set", err.message))
  }

  function destroy(key) {
    return sessions
      .deleteOne({ key })
      .catch(err => console.warn("session#destroy", err.message))
  }
}
