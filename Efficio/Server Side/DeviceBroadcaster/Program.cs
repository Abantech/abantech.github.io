using DeviceBroadcaster.Devices.Microsoft;
using System;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            //var xr3d = new XR3DBroadcaster();
            //xr3d.StartBroadcast();

            //var leap = new LeapMotionBroadcaster();
            //leap.StartBroadcast();

            //var audio = new StreamingAudio();
            //audio.StartBroadcast();

            var kinect = new KinectBroadcaster();
            kinect.StartBroadcast();

            Console.ReadLine();
        }
    }
}
