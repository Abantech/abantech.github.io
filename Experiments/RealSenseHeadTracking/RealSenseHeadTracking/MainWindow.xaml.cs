using Leap;
using Microsoft.Kinect;
using System;
using System.Linq;
using System.Configuration;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace RealSenseHeadTracking
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private DateTime lastClick = DateTime.Now;

        [DllImport("User32.dll")]
        private static extern bool SetCursorPos(int X, int Y);

        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo);

        /// <summary>
        /// Struct representing a point.
        /// </summary>
        [StructLayout(LayoutKind.Sequential)]
        public struct POINT
        {
            public int X;
            public int Y;

            public static implicit operator Point(POINT point)
            {
                return new Point(point.X, point.Y);
            }
        }

        /// <summary>
        /// Retrieves the cursor's position, in screen coordinates.
        /// </summary>
        /// <see>See MSDN documentation for further information.</see>
        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out POINT lpPoint);

        private const int MOUSEEVENTF_LEFTDOWN = 0x02;
        private const int MOUSEEVENTF_LEFTUP = 0x04;
        private const int MOUSEEVENTF_RIGHTDOWN = 0x08;
        private const int MOUSEEVENTF_RIGHTUP = 0x10;

        public MainWindow()
        {
            InitializeComponent();
            string deviceName = ConfigurationManager.AppSettings["Device"];

            switch (deviceName)
            {
                case "RealSense":
                    {
                        StartRealSense();
                        break;
                    }
                case "Leap":
                    {
                        StartLeap();
                        break;
                    }
                case "Kinect":
                    {
                        StartKinect();
                        break;
                    }
                default:
                    break;
            }
        }

        #region RealSense
        private Thread processingThread;
        private PXCMSenseManager senseManager;
        private PXCMFaceModule face;
        private PXCMFaceConfiguration faceConfig;
        private PXCMFaceData faceData;
        private PXCMSmoother smoother;
        private PXCMSmoother.Smoother2D smoother2D;
        private PXCMSmoother.Smoother2D smoother2D2;

        private PXCMHandModule hand;

        private void StartRealSense()
        {
            bool useHead = bool.Parse(ConfigurationManager.AppSettings["UseHead"]);

            // Instantiate and initialize the SenseManager
            senseManager = PXCMSenseManager.CreateInstance();

            // Configure the Hand Module
            if (useHead)
            {
                senseManager.EnableFace();

                face = senseManager.QueryFace();
                faceConfig = face.CreateActiveConfiguration();
                faceConfig.detection.isEnabled = true;
                faceConfig.QueryExpressions().Enable();

                faceConfig.ApplyChanges();
            }
            else
            {
                // Enable cursor tracking
                senseManager.EnableHand();

                // Get an instance of the hand cursor module
                hand = senseManager.QueryHand();

                // Get an instance of the cursor configuration
                var cursorConfig = hand.CreateActiveConfiguration();

                // Make configuration changes and apply them
                cursorConfig.DisableAllAlerts();
                cursorConfig.EnableTrackedJoints(true);
                cursorConfig.EnableStabilizer(true);
                cursorConfig.ApplyChanges();
            }

            senseManager.Init();

            // Create an instance of PXCMSmoother
            senseManager.session.CreateImpl<PXCMSmoother>(out smoother);
            smoother2D = smoother.Create2DQuadratic(.5F);
            smoother2D2 = smoother.Create2DQuadratic(1);

            // Start the worker thread
            processingThread = new Thread(new ThreadStart(ProcessingThread));
            processingThread.Start();
        }

        private void ProcessingThread()
        {
            // Start AcquireFrame/ReleaseFrame loop
            while (senseManager.AcquireFrame(true).IsSuccessful())
            {
                PXCMCapture.Sample sample = senseManager.QuerySample();

                #region face
                // Retrieve gesture data
                face = senseManager.QueryFace();

                if (face != null)
                {
                    // Retrieve the most recent processed data
                    faceData = face.CreateOutput();
                    faceData.Update();

                    if (faceData.QueryNumberOfDetectedFaces() > 0)
                    {
                        var face = faceData.QueryFaceByIndex(0);
                        var pose = face.QueryPose();

                        if (pose != null)
                        {
                            PXCMFaceData.PoseEulerAngles angles;
                            pose.QueryPoseAngles(out angles);

                            if (angles != null)
                            {
                                double correctedYaw = (angles.yaw + 20) / 40;

                                correctedYaw = correctedYaw < 1 ? correctedYaw : 1;
                                correctedYaw = correctedYaw > 0 ? correctedYaw : 0;

                                correctedYaw = Math.Round(correctedYaw, 2);
                                correctedYaw = correctedYaw - correctedYaw % .02;

                                double correctedPitch = (-angles.pitch - 9) / 8;

                                correctedPitch = correctedPitch < 1 ? correctedPitch : 1;
                                correctedPitch = correctedPitch > 0 ? correctedPitch : 0;

                                correctedPitch = Math.Round(correctedPitch, 2);
                                correctedPitch = correctedPitch - correctedPitch % .02;

                                Nullable<PXCMPointF32> point = new PXCMPointF32();

                                Dispatcher.Invoke(() =>
                                {
                                    double maxX = App.Current.MainWindow.RenderSize.Width;
                                    float currentX = Convert.ToSingle(maxX * correctedYaw);

                                    double maxY = App.Current.MainWindow.RenderSize.Height;
                                    float currentY = Convert.ToSingle(maxY * correctedPitch);

                                    point = new PXCMPointF32(currentX, currentY);
                                });

                                point = smoother2D.SmoothValue(point.Value);
                                point = smoother2D2.SmoothValue(point.Value);

                                SetCursorPosition(Convert.ToInt32(point.Value.x), Convert.ToInt32(point.Value.y));
                            }
                        }

                        var expressions = face.QueryExpressions();

                        if (expressions != null)
                        {
                            PXCMFaceData.ExpressionsData.FaceExpressionResult result;
                            expressions.QueryExpression(PXCMFaceData.ExpressionsData.FaceExpression.EXPRESSION_MOUTH_OPEN, out result);

                            if (result != null && result.intensity > 35)
                            {
                                Click();
                            }
                        }
                    }
                }
                #endregion

                #region hand
                hand = senseManager.QueryHand();

                if (hand != null)
                {
                    using (var handData = hand.CreateOutput())
                    {
                        handData.Update();

                        var handCount = handData.QueryNumberOfHands();

                        for (int i = 0; i < handCount; i++)
                        {
                            PXCMHandData.IHand handInfo;
                            handData.QueryHandData(PXCMHandData.AccessOrderType.ACCESS_ORDER_RIGHT_HANDS, i, out handInfo);

                            if (handInfo != null && handInfo.HasTrackedJoints())
                            {
                                if (handInfo.QueryBodySide() == PXCMHandData.BodySideType.BODY_SIDE_RIGHT)
                                {
                                    PXCMHandData.FingerData finger;
                                    handInfo.QueryFingerData(PXCMHandData.FingerType.FINGER_INDEX, out finger);

                                    Nullable<PXCMPointF32> mouseLocation = null;

                                    if (finger.foldedness > 85)
                                    {
                                        PXCMHandData.JointData joint;
                                        handInfo.QueryTrackedJoint(PXCMHandData.JointType.JOINT_INDEX_TIP, out joint);

                                        double appX = 0;
                                        double appY = 0;

                                        Dispatcher.Invoke(() =>
                                        {
                                            appX = App.Current.MainWindow.RenderSize.Width;
                                            appY = App.Current.MainWindow.RenderSize.Height;
                                        });

                                        var xScaled = (joint.positionImage.x - 580) * -1 * (appX / 640) * 1.2;
                                        var yScaled = (joint.positionImage.y - 60) * (appY / 480) * 1.6;

                                        mouseLocation = smoother2D.SmoothValue(new PXCMPointF32(Convert.ToSingle(xScaled), Convert.ToSingle(yScaled)));

                                        SetCursorPosition(Convert.ToInt32(mouseLocation.Value.x), Convert.ToInt32(mouseLocation.Value.y));
                                    }

                                    handInfo.QueryFingerData(PXCMHandData.FingerType.FINGER_PINKY, out finger);

                                    if (finger.foldedness > 85)
                                    {
                                        if (DateTime.Now - lastClick > new TimeSpan(0, 0, 2))
                                        {
                                            Click();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                #endregion

                // Update the user interface
                //UpdateUI(colorBitmap);

                // Release the frame
                if (faceData != null) faceData.Dispose();

                senseManager.ReleaseFrame();
            }
        }

        private void DestroyRealSense()
        {
            processingThread.Abort();
            if (faceData != null) faceData.Dispose();
            faceConfig.Dispose();
            senseManager.Dispose();
        }

        #endregion

        #region Leap
        private Controller controller;
        private Timer timer;

        private void StartLeap()
        {
            controller = new Controller();
            controller.SetPolicy(Controller.PolicyFlag.POLICY_BACKGROUND_FRAMES);

            // Start the worker thread
            processingThread = new Thread(new ThreadStart(LeapProcessThread));
            processingThread.Start();
        }

        private void LeapProcessThread()
        {
            timer = new Timer(ProcessFrame, null, 0, 16);
        }

        private void ProcessFrame(object state)
        {
            var frame = controller.Frame();

            if (frame.IsValid)
            {
                if (frame.Hands.Count > 0)
                {
                    var rightMostHand = frame.Hands.Rightmost;

                    if (rightMostHand.IsRight)
                    {
                        var finger = rightMostHand.Fingers[1];
                        bool fingerIsValid = finger.IsValid;

                        if (fingerIsValid)
                        {
                            if (finger.IsExtended)
                            {
                                var indexPoint = finger.TipPosition;
                                var normalizedIndex = frame.InteractionBox.NormalizePoint(indexPoint);

                                int x = 0;
                                int y = 0;

                                Dispatcher.Invoke(() =>
                                {
                                    x = Convert.ToInt32(App.Current.MainWindow.RenderSize.Width * normalizedIndex.x);
                                    y = Convert.ToInt32(App.Current.MainWindow.RenderSize.Height * (1 - normalizedIndex.y));
                                });

                                SetCursorPosition(x, y);
                            }
                        }


                        finger = rightMostHand.Fingers[0];
                        fingerIsValid = finger.IsValid;

                        if (fingerIsValid)
                        {
                            if (finger.IsExtended)
                            {
                                if (DateTime.Now - lastClick > new TimeSpan(0, 0, 2))
                                {
                                    Click();
                                    lastClick = DateTime.Now;
                                }
                            }
                        }
                    }
                }
            }
        }

        private void DestroyLeap()
        {
            timer.Dispose();
            controller.Dispose();
        }
        #endregion

        #region Kinect
        private KinectSensor kinectController;
        private BodyFrameReader reader;

        private void StartKinect()
        {
            controller = new Controller();
            controller.SetPolicy(Controller.PolicyFlag.POLICY_BACKGROUND_FRAMES);

            // Start the worker thread
            processingThread = new Thread(new ThreadStart(KinectProcessThread));
            processingThread.Start();
        }

        private void KinectProcessThread()
        {
            kinectController = KinectSensor.GetDefault();
            reader = kinectController.BodyFrameSource.OpenReader();
            reader.FrameArrived += Reader_FrameArrived;
            kinectController.Open();

            timer = new Timer(Test, null, 0, 16);
        }

        private void Test(object obj)
        {
            var frame = reader.AcquireLatestFrame();
        }

        private void Reader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            var frame = e.FrameReference.AcquireFrame();

            if (frame != null)
            {
                var bodyCount = frame.BodyCount;

                if (bodyCount > 0)
                {
                    var bodies = new Body[bodyCount];
                    frame.GetAndRefreshBodyData(bodies);

                    foreach (var body in bodies)
                    {
                        if (body != null && body.Joints != null) { }
                        {
                            var joint = body.Joints[JointType.HandRight];

                            if (joint != null && joint.TrackingState == TrackingState.Tracked)
                            {
                                var pos = joint.Position;

                                var mappedPoint = kinectController.CoordinateMapper.MapCameraPointToColorSpace(pos);

                                Four.Content = mappedPoint.X;
                                Five.Content = mappedPoint.Y;
                            }
                        }
                    }
                }
            }
        }

        private void DestroyKinect()
        {

        }
        #endregion

        #region Mouse Actions
        private void SetCursorPosition(int x, int y)
        {
            SetCursorPos(x, y);
        }

        private void Click()
        {
            POINT lpPoint;
            GetCursorPos(out lpPoint);

            mouse_event(MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_LEFTUP, lpPoint.X, lpPoint.Y, 0, 0);
        }
        #endregion

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            string deviceName = ConfigurationManager.AppSettings["Device"];

            switch (deviceName)
            {
                case "RealSense":
                    {
                        DestroyRealSense();
                        break;
                    }
                case "Leap":
                    {
                        DestroyLeap();
                        break;
                    }
                case "Kinect":
                    {
                        DestroyKinect();
                        break;
                    }
            }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Button bttn = (Button)sender;

            Window window = new Window()
            {
                Title = "Modal Dialog",
                ShowInTaskbar = false,               // don't show the dialog on the taskbar
                Topmost = true,                      // ensure we're Always On Top
                ResizeMode = ResizeMode.NoResize,    // remove excess caption bar buttons
                Owner = Application.Current.MainWindow,
                Content = bttn.Content
            };

            window.ShowDialog();

        }
    }
}
