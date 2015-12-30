using Microsoft.Kinect;
using System.IO;
using System.Linq;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System;

namespace DeviceBroadcaster.Devices.Microsoft
{
    class KinectBroadcaster : IBroadcaster
    {
        private string GetProtocolAsString(Protocol p) => p == Protocol.ws ? "ws" : "wss";

        private Server server;

        // Host information
        public Protocol HostProtocol { get; set; } = Protocol.ws;
        public string HostAddress { get; set; } = "127.0.0.1";
        public int HostPort { get; set; } = 3002;

        // Configuration
        public bool BroadcastCameraData { get; set; } = false;

        public void StartBroadcast()
        {
            CreateSever();
            StartServer();

            var kinect = new Kinect();
            kinect.DataReceived += this.BroadcastKinectData;
        }

        private void BroadcastKinectData(object sender, DataReceivedEventArgs e)
        {
            if (e.BodyData != null)
            {
                server.BroadcastMessage(e.BodyData);
            }

            if (this.BroadcastCameraData && e.Data != null)
            {
                server.BroadcastMessage(e.Data);
            }
        }

        private void CreateSever()
        {
            server = new Server(this.HostProtocol, this.HostAddress, this.HostPort, "kinect");
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
                    //server.BroadcastMessage(message, server.Clients.Where(x => !x.ConnectionInfo.Id.Equals(socket.ConnectionInfo.Id)));
                };

                socket.OnBinary = binary =>
                {
                    //server.BroadcastMessage(binary, server.Clients.Where(x => !x.ConnectionInfo.Id.Equals(socket.ConnectionInfo.Id)));
                };
            });
        }

        public void Dispose()
        {
            server.Dispose();
        }
    }
}
