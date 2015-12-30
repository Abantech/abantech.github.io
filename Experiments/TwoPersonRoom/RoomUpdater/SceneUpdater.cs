using DeviceBroadcaster;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoomUpdater
{
    class SceneUpdater
    {
        private string GetProtocolAsString(Protocol p) => p == Protocol.ws ? "ws" : "wss";

        private Server server;

        // Host information
        public Protocol HostProtocol { get; set; } = Protocol.ws;
        public string HostAddress { get; set; } = "0.0.0.0";
        public int HostPort { get; set; } = 3002;

        private Nullable<Guid> player1 = null;

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

                    socket.Send("{\"FirstInRoom\": " + (player1 == null ? "true" : "false") + "}");

                    Console.WriteLine($"Client {socket.ConnectionInfo.Id.ToString()} connected.");

                    if (player1 == null)
                    {
                        player1 = socket.ConnectionInfo.Id;
                    }
                };

                socket.OnClose = () =>
                {
                    server.Clients.Remove(socket);

                    Console.WriteLine($"Client {socket.ConnectionInfo.Id.ToString()} disconnected.");

                    if (player1.Equals(socket.ConnectionInfo.Id))
                    {
                        player1 = null;
                    }

                    server.BroadcastMessage("{\"Topic\": \"Partner Disconnected\"}");
                };

                socket.OnMessage = message =>
                {
                    LocationData loc = null;

                    try
                    {
                        loc = new System.Web.Script.Serialization.JavaScriptSerializer().Deserialize<LocationData>(message);

                        if (loc.Location == null)
                        {
                            loc = null;
                        }
                        else
                        {
                            Console.WriteLine($"Lat: {loc.Location.Latitude} Long: {loc.Location.Longitude}");
                        }
                    }
                    catch (Exception)
                    {
                        
                    }

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

        public enum Protocol
        {
            ws,
            wss
        }
    }
}
