
using DeviceBroadcaster.Devices.Leap_Motion;
using DeviceBroadcaster.Devices.Microsoft;
using Microsoft.Kinect;
using System;
using System.ServiceProcess;
using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Json;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            //var xr3d = new XR3DBroadcaster();
            //xr3d.StartBroadcast();

            //if (DeviceAvailable(Device.LeapMotion))
            //{
            //    var leap = new LeapMotionBroadcaster();
            //    leap.StartBroadcast();
            //}

            //var audio = new StreamingAudio();
            //audio.StartBroadcast();

            if (DeviceAvailable(Device.MicrosoftKinect))
            {
                var kinect = KinectSensor.GetDefault();
                var reader = kinect.BodyFrameSource.OpenReader();
                reader.FrameArrived += Reader_FrameArrived;
                kinect.Open();
            }

            Console.ReadLine();
        }

        private static void Reader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            // get total number of bodies from BodyFrameSource
            var bodies = new Body[(sender as BodyFrameReader).BodyFrameSource.BodyCount];
            using (BodyFrame bodyFrame = e.FrameReference.AcquireFrame())
            {
                if (bodyFrame != null)
                {
                    bodyFrame.GetAndRefreshBodyData(bodies);

                    if (bodies.ToList().Any(x => x.IsTracked))
                    {
                        var body = bodies.ToList().Where(x => x.IsTracked).First();
                    
                    }
                }
            }
        }

        private static bool DeviceAvailable(Device device)
        {
            string serviceName = string.Empty;
            bool deviceAvailable = false;

            switch (device)
            {
                case Device.LeapMotion:
                    {
                        serviceName = "LeapService";
                        break;
                    }
                case Device.MicrosoftKinect:
                    {
                        serviceName = "KinectMonitor";
                        break;
                    }
                case Device.XR3D:
                    {
                        break;
                    }
                default:
                    break;
            }

            if (!string.IsNullOrWhiteSpace(serviceName))
            {
               ServiceController sc = new ServiceController(serviceName);

                if (sc.Status.Equals(ServiceControllerStatus.Running))
                {
                    deviceAvailable = true;
                }
            }

            return deviceAvailable;
        }
    }
}
