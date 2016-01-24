using Microsoft.Kinect;
using System;

namespace DeviceBroadcaster.Devices.Microsoft
{
    interface IAvailabilityChangedEventHandler
    {
        Action<object, IsAvailableChangedEventArgs> AvailabilityChanged { get; }
        Server Server { get; set; }
    }
}
