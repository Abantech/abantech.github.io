using Fleck;
using RoomUpdater;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeviceBroadcaster
{
    class Server
    {
        private string GetProtocolAsString(RoomUpdater.SceneUpdater.Protocol p) => p == RoomUpdater.SceneUpdater.Protocol.ws ? "ws" : "wss";

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

        public Server(RoomUpdater.SceneUpdater.Protocol protocol, string address, int port)
        {
            this.server = new WebSocketServer(GetProtocolAsString(protocol) + "://" + address + ":" + port);
        }

        public void Start(Action<IWebSocketConnection> config)
        {
            server.Start(config);
        }

        public void BroadcastMessage(string message, IEnumerable<IWebSocketConnection> destinations = null)
        {
            if (destinations == null)
            {
                destinations = this.Clients;
            }

            foreach (IWebSocketConnection socket in destinations)
            {
                socket.Send(message);
            }
        }

        internal void BroadcastMessage(byte[] binary, IEnumerable<IWebSocketConnection> destinations = null)
        {
            if (destinations == null)
            {
                destinations = this.Clients;
            }

            foreach (IWebSocketConnection socket in destinations)
            {
                socket.Send(binary);
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