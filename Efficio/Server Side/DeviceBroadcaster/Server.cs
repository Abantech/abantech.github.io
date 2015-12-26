using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeviceBroadcaster
{
    class Server
    {
        private string GetProtocolAsString(Protocol p) => p == Protocol.ws ? "ws" : "wss";

        private WebSocketServer server;

        private List<IWebSocketConnection> clients;
        internal List<IWebSocketConnection> Clients
        {
            get
            {
                if (clients == null)
                {
                    clients = new List<IWebSocketConnection>();
                }

                return clients;
            }
            set
            {
                clients = value;
            }
        }

        public Server(Protocol protocol, string address, int port)
        {
            this.server = new WebSocketServer(GetProtocolAsString(protocol) + "://" + address + ":" + port);
        }

        public void Start(Action<string> onMessage)
        {
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    this.Clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    this.Clients.Remove(socket);
                };

                socket.OnMessage = onMessage;
            });
        }

        public void BroadcastMessage(string message)
        {
            foreach (IWebSocketConnection socket in this.Clients)
            {
                socket.Send(message);
            }
        }

        public void Dispose()
        {
            foreach (var client in this.Clients)
            {
                client.Close();
            }

            server.Dispose();
        }
    }
}
