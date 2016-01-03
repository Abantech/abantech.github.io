using DeviceBroadcaster.Devices.Audio;
using DeviceBroadcaster.Devices.Leap_Motion;
using DeviceBroadcaster.Devices.Microsoft;
using DeviceBroadcaster.Devices.XR3D;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
