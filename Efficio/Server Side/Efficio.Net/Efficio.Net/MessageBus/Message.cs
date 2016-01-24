using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Efficio.Net.MessageBus
{
    public class Message
    {
        private string Channel { get; }
        private string Topic { get; }
        private string Source { get; }
        private JObject Data { get; }

        public Message(string channel, string topic, string source, JObject data)
        {
            this.Channel = channel;
            this.Topic = topic;
            this.Source = source;
            this.Data = data;
        }

        public static Message Parse(string json)
        {
            return Parse(JObject.Parse(json));
        }

        public static Message Parse(JObject obj)
        {
            var messageData = (JObject)obj["Message"];
            var channel = (string)messageData["Channel"];
            var topic = (string)messageData["Topic"];
            var source = (string)messageData["Source"];

            return new Message(channel, topic, source, obj);
        }
    }
}
