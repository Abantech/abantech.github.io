// Efficio Internal Components
var bus = require('./Message Bus/MessageBus.js');
var hirp = require('./Human Input Recognition and Processing/HumanInputRecognitionAndProcessing.js');
var ami = require('./Asset Management And Inventory/AssetManager.js');
var constraintsEngine = require('./Constraints Engine/ConstraintsEngine.js');
var systemInterface = require('./3D System Interface/3DSystemInterface.js')
var internalScene = require('./InternalScene.js');
var sysNotificationListener = require('./Logging/SystemNotificationListener.js');

var leap;

module.exports = 
{
    Initialize: function () {
        bus.Initialize();
        hirp.Initialize();
        ami.Initialize();
        constraintsEngine.Initialize();
        systemInterface.Initialize();
        internalScene.Initialize();
        sysNotificationListener.Initialize();
        
        // Stub for simulating input
        leap = require('./Plugins/LeapMotion/LeapMotionStub.js'); //will make this read from config to allow whatever NUI device
        leap.Init();
    },
    
    Start: function () {
        var option = 0;
        
        //This loop calls stubs right now but will be execpted to read data from the NUI devices hooked up (return BVH data)    
        while (true) {
            if (Date.now() % 2000 === 0) {
                if (option === 0) {
                    leap.StubPinch();
                    
                    option = 1;
                }
                else {
                    if (option === 1) {
                        leap.StubGrasp();
                        
                        option = 2;
                    }
                    else {
                        if (option === 2) {
                            leap.StubCustomGesture();
                            
                            option = 0;
                        }
                    }
                }
            }
        }
    }
}