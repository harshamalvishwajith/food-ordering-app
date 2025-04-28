import { Kafka, Producer } from "kafkajs";

const kafka = new Kafka({
  clientId: "restaurant-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer: Producer = kafka.producer();

export const connectProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected (Restaurant Service)");
  } catch (error) {
    console.error("Error connecting Kafka producer:", error);
  }
};

export const sendMessage = async (
  topic: string,
  message: any
): Promise<void> => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  } catch (error) {
    console.error("Error sending Kafka message:", error);
  }
};
