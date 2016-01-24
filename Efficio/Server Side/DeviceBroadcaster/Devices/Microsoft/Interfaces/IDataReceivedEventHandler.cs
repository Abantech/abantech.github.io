using System;

namespace DeviceBroadcaster.Devices.Microsoft
{
    interface IDataReceivedEventHandler
    {
        Action<object, DataReceivedEventArgs> DataReceived { get; }

        Server Server { get; set; }
    }
}
