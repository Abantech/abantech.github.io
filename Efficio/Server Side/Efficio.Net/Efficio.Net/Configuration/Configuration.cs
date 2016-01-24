using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Efficio.Net.Configuration
{

    public class Configuration
    {
        public static Configuration Parse(string json)
        {
            return JsonConvert.DeserializeObject<Configuration>(json);
        }

        public static Configuration Parse(JObject obj)
        {
            return obj.ToObject<Configuration>();
        }

        private Configuration()
        {

        }

        public Devices Devices { get; set; }
        public Actiontofunctionmapping ActionToFunctionMapping { get; set; }
        public bool Debug { get; set; }
    }

    public class Devices
    {
        public bool Microphone { get; set; }
        public Kinect Kinect { get; set; }
        public Leapmotion Leapmotion { get; set; }
        public Realsense RealSense { get; set; }
        public XR3D XR3D { get; set; }
        public Location Location { get; set; }
        public bool Orientation { get; set; }
    }

    public class Kinect
    {
        public string Host { get; set; }
        public int Version { get; set; }
    }

    public class Leapmotion
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableGestures { get; set; }
        public string FrameEventName { get; set; }
        public bool UseAllPlugins { get; set; }
    }

    public class Realsense
    {
        public string SenseType { get; set; }
        public bool Gestures { get; set; }
    }

    public class XR3D
    {
        public string Host { get; set; }
    }

    public class Location
    {
        public int PollingInterval { get; set; }
    }

    public class Actiontofunctionmapping
    {
        public string Bridge { get; set; }
        public Actionmapping[] ActionMappings { get; set; }
    }

    public class Actionmapping
    {
        public string Topic { get; set; }
        public string Source { get; set; }
        public string Action { get; set; }
        public Firerestrictions FireRestrictions { get; set; }
        public Argument[] Arguments { get; set; }
    }

    public class Firerestrictions
    {
        public bool FireOnce { get; set; }
        public int FireAfterXFrames { get; set; }
    }

    public class Argument
    {
        public string Source { get; set; }
        public string Name { get; set; }
        public string MapTo { get; set; }
    }
}
