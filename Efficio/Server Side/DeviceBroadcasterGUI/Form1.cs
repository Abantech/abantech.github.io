using DeviceBroadcaster.Devices.Leap_Motion;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DeviceBroadcasterGUI
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void StartLeapButton_Click(object sender, EventArgs e)
        {
            var leap = new LeapMotionBroadcaster();
            leap.ClientProtocol = ClientBinding.SelectedText == "ws" ? DeviceBroadcaster.Protocol.ws : DeviceBroadcaster.Protocol.wss;
            leap.ClientServerAddress = ClientAddress.Text;
            leap.ClientPort = int.Parse(ClientPort.Text);

            leap.HostProtocol = ServerBinding.SelectedText == "ws" ? DeviceBroadcaster.Protocol.ws : DeviceBroadcaster.Protocol.wss;
            leap.HostAddress = ServerAddress.Text;
            leap.HostPort = int.Parse(ServerPort.Text);

            leap.Configure();
            leap.StartBroadcast();
        }
    }
}
