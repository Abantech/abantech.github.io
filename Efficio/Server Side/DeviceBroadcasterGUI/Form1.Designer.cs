namespace DeviceBroadcasterGUI
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.LeapMotion = new System.Windows.Forms.TabPage();
            this.StartLeapButton = new System.Windows.Forms.Button();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.label4 = new System.Windows.Forms.Label();
            this.ServerPort = new System.Windows.Forms.TextBox();
            this.ServerAddress = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.ServerBinding = new System.Windows.Forms.ComboBox();
            this.label6 = new System.Windows.Forms.Label();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.label3 = new System.Windows.Forms.Label();
            this.ClientPort = new System.Windows.Forms.TextBox();
            this.ClientAddress = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.ClientBinding = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.tabControl1.SuspendLayout();
            this.LeapMotion.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.LeapMotion);
            this.tabControl1.Controls.Add(this.tabPage2);
            this.tabControl1.Location = new System.Drawing.Point(13, 13);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(270, 272);
            this.tabControl1.TabIndex = 0;
            // 
            // LeapMotion
            // 
            this.LeapMotion.Controls.Add(this.StartLeapButton);
            this.LeapMotion.Controls.Add(this.groupBox2);
            this.LeapMotion.Controls.Add(this.groupBox1);
            this.LeapMotion.Location = new System.Drawing.Point(4, 22);
            this.LeapMotion.Name = "LeapMotion";
            this.LeapMotion.Padding = new System.Windows.Forms.Padding(3);
            this.LeapMotion.Size = new System.Drawing.Size(262, 246);
            this.LeapMotion.TabIndex = 0;
            this.LeapMotion.Text = "Leap Motion";
            this.LeapMotion.UseVisualStyleBackColor = true;
            // 
            // StartLeapButton
            // 
            this.StartLeapButton.Location = new System.Drawing.Point(173, 217);
            this.StartLeapButton.Name = "StartLeapButton";
            this.StartLeapButton.Size = new System.Drawing.Size(75, 23);
            this.StartLeapButton.TabIndex = 7;
            this.StartLeapButton.Text = "Start";
            this.StartLeapButton.UseVisualStyleBackColor = true;
            this.StartLeapButton.Click += new System.EventHandler(this.StartLeapButton_Click);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Controls.Add(this.ServerPort);
            this.groupBox2.Controls.Add(this.ServerAddress);
            this.groupBox2.Controls.Add(this.label5);
            this.groupBox2.Controls.Add(this.ServerBinding);
            this.groupBox2.Controls.Add(this.label6);
            this.groupBox2.Location = new System.Drawing.Point(7, 115);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(247, 102);
            this.groupBox2.TabIndex = 6;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Efficio Server";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(7, 78);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(26, 13);
            this.label4.TabIndex = 5;
            this.label4.Text = "Port";
            // 
            // ServerPort
            // 
            this.ServerPort.Location = new System.Drawing.Point(67, 75);
            this.ServerPort.Name = "ServerPort";
            this.ServerPort.Size = new System.Drawing.Size(158, 20);
            this.ServerPort.TabIndex = 4;
            this.ServerPort.Text = "8181";
            // 
            // ServerAddress
            // 
            this.ServerAddress.Location = new System.Drawing.Point(67, 48);
            this.ServerAddress.Name = "ServerAddress";
            this.ServerAddress.Size = new System.Drawing.Size(158, 20);
            this.ServerAddress.TabIndex = 3;
            this.ServerAddress.Text = "127.0.0.1";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(7, 50);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(45, 13);
            this.label5.TabIndex = 2;
            this.label5.Text = "Address";
            // 
            // ServerBinding
            // 
            this.ServerBinding.FormattingEnabled = true;
            this.ServerBinding.Items.AddRange(new object[] {
            "ws",
            "wss"});
            this.ServerBinding.Location = new System.Drawing.Point(67, 20);
            this.ServerBinding.Name = "ServerBinding";
            this.ServerBinding.Size = new System.Drawing.Size(158, 21);
            this.ServerBinding.TabIndex = 1;
            this.ServerBinding.Text = "ws";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(7, 23);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(42, 13);
            this.label6.TabIndex = 0;
            this.label6.Text = "Binding";
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.ClientPort);
            this.groupBox1.Controls.Add(this.ClientAddress);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.ClientBinding);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(7, 7);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(247, 102);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Leap Motion Server";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(7, 78);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(26, 13);
            this.label3.TabIndex = 5;
            this.label3.Text = "Port";
            // 
            // ClientPort
            // 
            this.ClientPort.Location = new System.Drawing.Point(67, 75);
            this.ClientPort.Name = "ClientPort";
            this.ClientPort.Size = new System.Drawing.Size(158, 20);
            this.ClientPort.TabIndex = 4;
            this.ClientPort.Text = "6437";
            // 
            // ClientAddress
            // 
            this.ClientAddress.Location = new System.Drawing.Point(67, 48);
            this.ClientAddress.Name = "ClientAddress";
            this.ClientAddress.Size = new System.Drawing.Size(158, 20);
            this.ClientAddress.TabIndex = 3;
            this.ClientAddress.Text = "localhost";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(7, 50);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(45, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Address";
            // 
            // ClientBinding
            // 
            this.ClientBinding.FormattingEnabled = true;
            this.ClientBinding.Items.AddRange(new object[] {
            "ws",
            "wss"});
            this.ClientBinding.Location = new System.Drawing.Point(67, 20);
            this.ClientBinding.Name = "ClientBinding";
            this.ClientBinding.Size = new System.Drawing.Size(158, 21);
            this.ClientBinding.TabIndex = 1;
            this.ClientBinding.Text = "ws";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(7, 23);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(42, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Binding";
            // 
            // tabPage2
            // 
            this.tabPage2.Location = new System.Drawing.Point(4, 22);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage2.Size = new System.Drawing.Size(262, 246);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "tabPage2";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(288, 287);
            this.Controls.Add(this.tabControl1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.tabControl1.ResumeLayout(false);
            this.LeapMotion.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage LeapMotion;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.ComboBox ClientBinding;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button StartLeapButton;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox ServerPort;
        private System.Windows.Forms.TextBox ServerAddress;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.ComboBox ServerBinding;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox ClientPort;
        private System.Windows.Forms.TextBox ClientAddress;
        private System.Windows.Forms.Label label2;
    }
}

