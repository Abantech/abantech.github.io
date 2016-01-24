
using DeviceBroadcaster.Devices.Leap_Motion;
using DeviceBroadcaster.Devices.Microsoft;
using System;
using System.ServiceProcess;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            //var xr3d = new XR3DBroadcaster();
            //xr3d.StartBroadcast();

            if (DeviceAvailable(Device.LeapMotion))
            {
                var leap = new LeapMotionBroadcaster();
                leap.StartBroadcast();
            }

            //var audio = new StreamingAudio();
            //audio.StartBroadcast();

            if (DeviceAvailable(Device.MicrosoftKinect))
            {
                var kinect = new KinectBroadcaster();
                kinect.StartBroadcast();
            }

            Console.ReadLine();
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
