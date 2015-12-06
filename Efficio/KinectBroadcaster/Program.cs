using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;

namespace KinectBroadcaster
{
    /// <summary>
    /// Broadcasts Kinect 1.8 skeleton frames
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            Broadcaster context = null;
            try
            {
                context = new Broadcaster(SkeletonTrackingMode.Seated);
                context.StartBroadCast();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            finally
            {
                // show console and then dispose context
                Console.ReadLine();
                context.Dispose();
            }
        }
    }
}
