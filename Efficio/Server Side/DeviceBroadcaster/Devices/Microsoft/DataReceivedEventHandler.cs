using System;

namespace DeviceBroadcaster.Devices.Microsoft
{
    internal class DataReceivedEventHandler : IDataReceivedEventHandler
    {
        public Action<object, DataReceivedEventArgs> DataReceived
        {
            get
            {
                return OnDataReceived;
            }
        }

        private void OnDataReceived(object sender, DataReceivedEventArgs e)
        {
            //TODO handle data receieved
        }

        public Server Server { get; set; }
    }
}