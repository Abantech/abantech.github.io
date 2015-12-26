using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeviceBroadcaster
{
    public interface IBroadcaster
    {
        void StartBroadcast();

        void Dispose();
    }

    public enum Protocol
    {
        ws,
        wss
    }
}
