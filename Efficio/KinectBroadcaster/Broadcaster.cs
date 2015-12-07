using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;
using Fleck;
using System.Web.Script.Serialization;

namespace KinectBroadcaster
{
    /// <summary>
    /// Broadcasts Kinect sensor 1.8 data through web sockets
    /// </summary>
    public class Broadcaster: IDisposable
    {
        #region Constructors

        private Broadcaster()
        {
            _clients = new List<IWebSocketConnection>();
            sensor = null;
            trackType = SkeletonTrackingMode.Default;
        }

        /// <summary>
        /// Broadcasts Kinect sensor data depending on skeleton type - Seated or Default
        /// </summary>
        /// <param name="inputTrackType"></param>
        public Broadcaster(SkeletonTrackingMode inputTrackType)
            : this()
        {        
            trackType = inputTrackType;                     
        }

        #endregion

        #region Properties

        /// <summary>
        /// Kinect sensor that will retrieve data
        /// </summary>
        private KinectSensor sensor;

        /// <summary>
        /// List of clients that socket will be added to
        /// </summary>
        private List<IWebSocketConnection> _clients;

        /// <summary>
        /// Type of Skeleton to track - seated or non seated
        /// </summary>
        private SkeletonTrackingMode trackType;

        /// <summary>
        /// Server to pass data to
        /// </summary>
        private WebSocketServer server;

        #endregion

        #region Methods

        /// <summary>
        /// Starts broadcasting Kinect Skeleton data to Server
        /// </summary>
        public void StartBroadCast()
        {
            StartServer();
            StartKinect();
        }

        /// <summary>
        /// Clean Up
        /// </summary>
        public void Dispose()
        {
            try
            {
                if(sensor != null)
                {
                    sensor.Stop();
                }

                if(server != null)
                {
                    server.Dispose();
                }

                sensor = null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Initialize Connection to Server and run
        /// </summary>
        private void StartServer()
        {

            Console.WriteLine("Starting Server...");
            server = new WebSocketServer("ws://localhost:8181");
            //server = new WebSocketServer("http://192.168.1.213:8181");
            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    _clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    _clients.Remove(socket);
                };
                socket.OnMessage = message =>
                {

                    Console.WriteLine("Message:  " + message);
                };
            });
            Console.WriteLine("Server Started...");

        }

        /// <summary>
        /// Starts the Kinect sensor 
        /// </summary>
        private void StartKinect()
        {
            Console.WriteLine("Retrieving Kinect sensor...");
            sensor = KinectSensor.KinectSensors.Where(x => x.Status.Equals(KinectStatus.Connected)).FirstOrDefault();

            if (null != this.sensor)
            {
                Console.WriteLine("Sensor Retrieved...");
                // Turn on the skeleton stream to receive skeleton frames
                this.sensor.SkeletonStream.Enable();

                // Add an event handler to be called whenever there is new skeleton data
                this.sensor.SkeletonFrameReady += this.SensorSkeletonFrameReady;

                // Set the tracking mode
                this.sensor.SkeletonStream.TrackingMode = trackType;

                // Start the sensor!
                try
                {
                    this.sensor.Start();
                    Console.WriteLine("Sensor Started...");
                }
                catch (Exception)
                {
                    this.sensor = null;
                }
            }
            else
            {
                Console.WriteLine("Could not find Sensor...");
            }

        }

        /// <summary>
        /// Event handler for Kinect sensor's SkeletonFrameReady event
        /// </summary>
        /// <param name="sender">object sending the event</param>
        /// <param name="e">event arguments</param>
        private void SensorSkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
        {
            Skeleton[] skeletons = new Skeleton[0];

            // Retrieve all Skeleton Frames and insert into array
            using (SkeletonFrame skeletonFrame = e.OpenSkeletonFrame())
            {
                if (skeletonFrame != null)
                {
                    skeletons = new Skeleton[skeletonFrame.SkeletonArrayLength];
                    skeletonFrame.CopySkeletonDataTo(skeletons);
                }
            }

            // Convert skeleton frame into JSON - skip un-tracked skeletons
            foreach (Skeleton skeletonFrame in skeletons.Where(x => !x.TrackingState.Equals(SkeletonTrackingState.NotTracked)))
            {
                // Serialize skeleton
                string json = new JavaScriptSerializer().Serialize(skeletonFrame);

                // Send in socket
                foreach (IWebSocketConnection socket in _clients)
                {
                    socket.Send(json);
                }
            }       
        }

        #endregion
    }
}
