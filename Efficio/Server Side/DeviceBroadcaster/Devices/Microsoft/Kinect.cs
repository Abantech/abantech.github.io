using Microsoft.Kinect;
using System;
using System.Linq;
using System.Collections.Generic;

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
            var reader = this.kinectSensor.BodyFrameSource.OpenReader();
            reader.FrameArrived += Reader_FrameArrived;

            this.kinectSensor.Open();

            while (this.kinectSensor.IsOpen)
            {

            }
        }

        private void Reader_FrameArrived(object sender, BodyFrameArrivedEventArgs e)
        {
            // get total number of bodies from BodyFrameSource
            var bodies = new Body[this.kinectSensor.BodyFrameSource.BodyCount];
            e.FrameReference.AcquireFrame().GetAndRefreshBodyData(bodies);
            List<Body> bodiesList = new List<Body>();
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