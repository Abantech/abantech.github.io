using Microsoft.Kinect;
using System;

namespace DeviceBroadcaster.Devices.Microsoft
{
    internal class Kinect
    {
        private KinectSensor kinectSensor;
        private Action<object, DataReceivedEventArgs> broadcastKinectData;

        public Kinect()
        {
            // one sensor is currently supported
            this.kinectSensor = KinectSensor.GetDefault();

            // set IsAvailableChanged event notifier
            this.kinectSensor.IsAvailableChanged += this.Sensor_IsAvailableChanged;
        }

        public void Start()
        {
            // open the sensor
            this.kinectSensor.Open();
        }

        public Action<object, DataReceivedEventArgs> DataReceived { get; internal set; }

        public Action<object, IsAvailableChangedEventArgs> AvailabilityChange { get; internal set; }


        private void OnDataReceived(DataReceivedEventArgs e)
        {
            if (DataReceived != null)
                DataReceived(this, e);
        }

        private void Sensor_IsAvailableChanged(object sender, IsAvailableChangedEventArgs e)
        {
            if (AvailabilityChange != null)
                AvailabilityChange(this, e);
        }

    }

    internal class DataReceivedEventArgs
    {
        public string BodyData { get; internal set; }
        public string Data { get; internal set; }

        public DataReceivedEventArgs(string bodyData = null, string data = null)
        {
            this.BodyData = bodyData;
            this.Data = data;
        }
    }
}