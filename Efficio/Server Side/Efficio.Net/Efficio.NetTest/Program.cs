using Efficio.Net.Configuration;
using Efficio.Net.MessageBus;
using Newtonsoft.Json;

namespace Efficio.NetTest
{
    class Program
    {
        static void Main(string[] args)
        {
            var message = Message.Parse("{\"Input\":{\"TrackingType\":\"Orientation\",\"DeviceOrientation\":{}},\"GestureInformation\":{\"StartTime\":\"2016-01-03T22:34:40.908Z\",\"EndTime\":null,\"FireCount\":0},\"Message\":{\"Channel\":\"Input.Processed.Efficio.Device\",\"Topic\":\"RawOrientationData\",\"Source\":\"Efficio Device Grimoire\"}}");
            var configuration = Configuration.Parse("{\"Devices\":{\"Microphone\":false,\"Kinect\":{\"Host\":\"ws://localhost:8181\",\"Version\":2},\"Leapmotion\":{\"Host\":\"localhost\",\"Port\":6437,\"EnableGestures\":false,\"FrameEventName\":\"animationFrame\",\"UseAllPlugins\":false},\"RealSense\":{\"SenseType\":\"Hands\",\"Gestures\":false},\"XR3D\":{\"Host\":\"ws://localhost:8181\"},\"Location\":{\"PollingInterval\":3},\"Orientation\":true},\"ActionToFunctionMapping\":{\"Bridge\":\"Test\",\"ActionMappings\":[{\"Topic\":\"RawOrientationData\",\"Source\":\"Input.Processed.Efficio.Device\",\"Action\":\"a\",\"FireRestrictions\":{\"FireOnce\":true,\"FireAfterXFrames\":10},\"Arguments\":[{\"Source\":\"Data\",\"Name\":\"DataValue\",\"MapTo\":\"FunctionValue\"}]}]},\"Debug\":false}");
            string json = JsonConvert.SerializeObject(configuration);

        }
    }
}
