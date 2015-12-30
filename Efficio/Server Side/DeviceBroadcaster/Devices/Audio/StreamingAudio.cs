using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;

namespace DeviceBroadcaster.Devices.Audio
{
    class StreamingAudio
    {
        private string GetProtocolAsString(Protocol p) => p == Protocol.ws ? "ws" : "wss";

        private Server server;

        // Host information
        public Protocol HostProtocol { get; set; } = Protocol.ws;
        public string HostAddress { get; set; } = "127.0.0.1";
        public int HostPort { get; set; } = 3002;

        public void StartBroadcast()
        {
            CreateSever();
            StartServer();
        }

        private void CreateSever()
        {
            server = new Server(this.HostProtocol, this.HostAddress, this.HostPort);
        }

        private void StartServer()
        {
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    server.Clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    server.Clients.Remove(socket);
                };

                socket.OnMessage = message =>
                {
                    server.BroadcastMessage(message, server.Clients.Where(x => !x.ConnectionInfo.Id.Equals(socket.ConnectionInfo.Id)));
                };

                socket.OnBinary = binary =>
                {
                    server.BroadcastMessage(binary, server.Clients.Where(x => !x.ConnectionInfo.Id.Equals(socket.ConnectionInfo.Id)));
                };
            });
        }

        public void Dispose()
        {
            server.Dispose();
        }
    }
}
