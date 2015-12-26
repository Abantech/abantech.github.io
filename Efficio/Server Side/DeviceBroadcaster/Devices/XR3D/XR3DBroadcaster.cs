using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Xtr3D.Net;
using Xtr3D.Net.AllFrames;
using Xtr3D.Net.BaseTypes;
using Xtr3D.Net.ColorImage;
using Xtr3D.Net.Exceptions;
using Xtr3D.Net.ExtremeMotion;
using Xtr3D.Net.ExtremeMotion.Data;
using Xtr3D.Net.ExtremeMotion.Gesture;

namespace DeviceBroadcaster.Devices.XR3D
{
    class XR3DBroadcaster : IBroadcaster
    {
        private List<IWebSocketConnection> clients;
        private List<IWebSocketConnection> Clients
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
        private WebSocketServer server;

        private ImageInfo m_imageInfo;

        // Settings
        public bool IsHD { get; set; } = false;
        public bool EnableSmoothing { get; set; } = false;
        public float Smoothing { get; set; } = .6f;
        public float Correction { get; set; } = .4f;
        public int OutlierRemovalSensitivity { get; set; } = 10;
        public int MaxNumberOfConsecutiveRemovals { get; set; } = 10;


        public void StartBroadcast()
        {
            var errorMessage = ConnectToCamera();

            if (!string.IsNullOrWhiteSpace(errorMessage))
            {
                Console.WriteLine("Connection to camera failed with message: " + errorMessage);
                return;
            }

            RegisterListners();
            Start();
        }

        public void Dispose()
        {
            GeneratorSingleton.Instance.Shutdown();
            GeneratorSingleton.Instance.Dispose();

            foreach (var client in this.Clients)
            {
                client.Close();
            }

            server.Dispose();
        }

        private string ConnectToCamera()
        {
            string errorMessage = string.Empty;

            if (this.IsHD)
            {
                m_imageInfo = new ImageInfo(ImageResolution.Resolution1920x1080, Xtr3D.Net.ImageInfo.ImageFormat.RGB888);

            }
            else
            {
                m_imageInfo = new ImageInfo(ImageResolution.Resolution640x480, Xtr3D.Net.ImageInfo.ImageFormat.RGB888);
            }
            try
            {
                GeneratorSingleton.Instance.Initialize(PlatformType.WINDOWS, m_imageInfo);
            }
            catch (MissingLicenseException)
            {
                errorMessage = "Missing License";
            }
            catch (InvalidLicenseException)
            {
                errorMessage = "Invalid License";
            }
            catch (ExpiredLicenseException)
            {
                errorMessage = "Expired License";
            }
            catch (NoSuitableCameraException)
            {
                errorMessage = "No Suitable Camera Found";
            }
            catch (InvalidImageFormatException)
            {
                errorMessage = "Invalid image format";
            }
            catch (InvalidImageResolutionException)
            {
                errorMessage = "Invalid image resolution";
            }

            return errorMessage;
        }

        private void RegisterListners()
        {

            GeneratorSingleton.Instance.SetGestureRecognitionFile("SamplePoses.xml");

            //Register to the AllFramesReady event with our event handler, which will synchronize between camera and skeleton and draw them on the screen.
            //In case displaying the skeleton is not needed (e.g. calibration stage), using only GeneratorSingleton.Instance.ColorImageFrameReady results in better performance.
            //For that matter, see MyAllFramesReadyEventHandler on how to easily allow switching between waiting for synchronized frames, 
            //coming from all streams (via GeneratorSingleton.Instance.AllFramesReady) 
            //and waiting separately for each stream (GeneratorSingleton.Instance.DataFrameReady and GeneratorSingleton.Instance.ColorImageFrameReady).
            GeneratorSingleton.Instance.AllFramesReady +=
                            new EventHandler<AllFramesReadyEventArgs>(MyAllFramesReadyEventHandler);
        }

        private void Start()
        {
            // Start event pumping
            GeneratorSingleton.Instance.Start();
            if (this.EnableSmoothing)
            {
                GeneratorSingleton.Instance.DataStream.Enable(new TransformSmoothParameters()
                {
                    Smoothing = this.Smoothing,
                    Correction = this.Correction,
                    OutlierRemovalSensitivity = this.OutlierRemovalSensitivity,
                    MaxNumberOfConsecutiveRemovals = this.MaxNumberOfConsecutiveRemovals
                });
            }
        }

        private void MyAllFramesReadyEventHandler(object sender, AllFramesReadyEventArgs e)
        {
            using (var allFrames = e.OpenFrame() as AllFramesFrame)
            {
                if (allFrames != null)
                {
                    foreach (var evtArgs in allFrames.FramesReadyEventArgs)
                    {
                        if (evtArgs.GetType().Equals(typeof(ColorImageFrameReadyEventArgs)))
                        {
                            HandleColorImageEvent(evtArgs as ColorImageFrameReadyEventArgs);
                        }
                        else
                        {
                            if (evtArgs.GetType().Equals(typeof(GesturesFrameReadyEventArgs)))
                            {
                                HandleGestureEvent(evtArgs as GesturesFrameReadyEventArgs);
                            }
                            else
                            {
                                if (evtArgs.GetType().Equals(typeof(DataFrameReadyEventArgs)))
                                {
                                    HandleDataEvent(evtArgs as DataFrameReadyEventArgs);
                                }
                            }
                        }
                    }
                }
            }
        }

        private void HandleDataEvent(DataFrameReadyEventArgs dataFrameReadyEventArgs)
        {
            using (var dataFrame = dataFrameReadyEventArgs.OpenFrame() as DataFrame)
            {

                if (dataFrame != null) // Making sure it's really DataFrame
                {
                    StringBuilder text = new StringBuilder();
                    Skeleton skel = dataFrame.Skeletons[0];
                    if (dataFrame.Skeletons[0] != null)
                    {
                        var joints = dataFrame.Skeletons[0].Joints; // Possibly several Skeletons, we'll use the first
                        TrackingState state = dataFrame.Skeletons[0].TrackingState;
                        // We only want to display a tracked Skeleton
                        if (state == TrackingState.Tracked)
                        {
                            // Serialize skeleton
                            string json = new JavaScriptSerializer().Serialize(dataFrame.Skeletons[0]);

                            SendData(json);
                        }
                    }
                }
            }
        }

        private void HandleGestureEvent(GesturesFrameReadyEventArgs gesturesFrameReadyEventArgs)
        {
            //TODO Send Gesture
        }

        private void HandleColorImageEvent(ColorImageFrameReadyEventArgs colorImageFrameReadyEventArgs)
        {
            //TODO Send Color Image
        }

        private void SendData(string json)
        {
            foreach (IWebSocketConnection socket in this.Clients)
            {
                socket.Send(json);
            }
        }
    }
}
