interface WorkerMessage {
  action: string;
  payload: object;
}

export function createWorker() {
  process.on("message", handleMessage)

  function handleMessage(message: WorkerMessage) {
    console.log("message: ", JSON.stringify(message));
  }
}

if (!module.parent) {
  createWorker()
}
