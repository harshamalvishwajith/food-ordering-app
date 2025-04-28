using Confluent.Kafka;
using System;
using System.Threading.Tasks;

namespace MenuService.Kafka
{
    public class KafkaProducer
    {
        private readonly string _bootstrapServers;
        private readonly string _topic;

        public KafkaProducer(string bootstrapServers, string topic)
        {
            _bootstrapServers = bootstrapServers;
            _topic = topic;
        }

        public async Task SendMessageAsync(string message)
        {
            var config = new ProducerConfig { BootstrapServers = _bootstrapServers };

            using var producer = new ProducerBuilder<Null, string>(config).Build();

            try
            {
                var result = await producer.ProduceAsync(
                    _topic,
                    new Message<Null, string> { Value = message }
                );

                Console.WriteLine($"✅ Delivered '{result.Value}' to '{result.TopicPartitionOffset}'");
            }
            catch (ProduceException<Null, string> e)
            {
                Console.WriteLine($"❌ Delivery failed: {e.Error.Reason}");
            }
        }
    }
}
