/**
 * Queue API based on RabbitQM
 */
import Debug from "debug";
import { connect, Connection, Channel, ConsumeMessage, Options } from "amqplib";
import { config } from "../lib/config";

const debug = Debug("adapters:pubsub");

/**
 * Publish message
 */
export async function sendToQueue(queue: string, message: Buffer, options?: Options.Publish) {
  const channel = await getChannel(queue);

  return await channel.sendToQueue(queue, message, options);
}

/**
 * Subscribe for messages
 */
export async function consume(queue: string, listener: (msg: ConsumeMessage | null) => any) {
  const channel = await getChannel(queue);

  await channel.consume(queue, async function(message) {
    try {
      await listener(message);
      await channel.ack(message);
    }
    catch(err) {
      console.error("Error during consuming message")
      console.error(err);
    }
  }, {
    noAck: false
  })
}

/**
 * Disconnect from service
 */
export async function disconnect() {
  return await closeConnection();
}

// Private methods
const channels = new Map<string, Channel>();
let connection: Connection;

async function getConnection() {
  if (!connection) {
    return connection = await connect(config.CLOUDAMQP_URL);
  }

  return connection;
}

async function closeConnection() {
  channels.clear();

  if (connection) {
    await connection.close().catch((err: Error) => debug("error when closing connection: %s", err.message));
  }
}

async function getChannel(channelName: string): Promise<Channel> {
  if (channels.has(channelName)) {
    return channels.get(channelName)
  }

  const conn = await getConnection();
  const channel = await conn.createChannel();

  await channel.assertQueue(channelName, {
    durable: true
  });

  await channel.prefetch(1);

  channels.set(channelName, channel);

  return channel;
}
