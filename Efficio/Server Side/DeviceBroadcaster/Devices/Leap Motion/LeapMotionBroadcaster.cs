using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;

namespace DeviceBroadcaster.Devices.Leap_Motion
{
    public class LeapMotionBroadcaster : IBroadcaster
    {
        private string GetProtocolAsString(Protocol p) => p == Protocol.ws ? "ws" : "wss";

        private Server server;
        private WebSocket client;

        // Host information
        public Protocol HostProtocol { get; set; } = Protocol.ws;
        public string HostAddress { get; set; } = "127.0.0.1";
        public int HostPort { get; set; } = 8181;

        // Client Information
        public Protocol ClientProtocol { get; set; } = Protocol.ws;
        public string ClientServerAddress { get; set; } = "localhost";
        public int ClientPort { get; set; } = 6437;

        public void StartBroadcast()
        {
            CreateSever(); 
            CreateClient();
            StartServer();
            StartClient();
        }

        private void CreateSever()
        {
            server = new Server(this.HostProtocol, this.HostAddress, this.HostPort, "leap");
        }

        private void CreateClient()
        {
            client = new WebSocket(GetProtocolAsString(this.ClientProtocol) + "://" + this.ClientServerAddress + ":" + this.ClientPort + "/v6.json");

            client.OnMessage += (o, e) =>
            {
                server.BroadcastMessage(e.Data);
            };
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
                    client.Send(message);
                };
            });
        }

        private void StartClient()
        {
            client.Connect();
        }

        public void Dispose()
        {
            server.Dispose();
            client.Close(CloseStatusCode.Normal, "Broadcaster shut down");
        }
    }
}
