Efficio Engine v0.0.0.1
=======================

The Efficio Engine is a [Human Computer Interaction]( https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction ) (HCI) device processor aimed at device abstraction, input interpretation, and signal fusion designed for rapid development. Our aim is to achieve the lofty goal of Efficio Engine:
>Any device, any appication, any platform in no time!

This project is our first attempt at achieving this goal. It exists as much as a means of discovery for ourselves as it is a tool for others.

Deployment
----------
There are only 4 steps to deploying the Efficio engine on an existing JavaScript-enabled application:

1. Reference Efficio library and dependencies.

	Add the reference to the Efficio JavaScript library within the HTML document you wish to HCI enable. For your convenience, below are the CDN links to the files you'll need.

	```html
	<script src="https://cdn.rawgit.com/Abantech/abantech.github.io/master/Farside%20Integration/AutoDesk/AutoCADEndUser/scripts/EfficioIntegration/Configuration/RequireConfiguration.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
	```

2. Edit Action to function mapping.
  
	The Action-to-function mapping (henceforth reffered to as A2FM) is a way to instruct the Efficio engine to execute a particular function when a particular action is performed. This is done by creating an ActionToFunctionMapping object. For example, if you wish to create an alert when the user pinches with their right hand using the thumb and index finger, the following A2FM object can be made:

	```javascript
  	var ActionToFunctionMapping = {
		ActionMappings:[{
			Topic: "RightHandThumbIndexPinch",
          		Source: "Input.Processed.Efficio",
          		Action: function (data) {
              			alert("Pinch Detected!");
          		}
	  	}]
  	}
  	```
  
	A full list of the possible actions to which a user can subscribe can be found here (TODO add link).  Note that the ActionMappings property is an array of actions, indicating that the relationship of actions and functions are many-to-many. More than one action can invoke a particular function and more than one function can be invoked  by a particular action.

	Finally, to control whether or not an action should be executed, the A2FM exposes a ExecutionPrerequisites. ExecutionPrerequisites control whether or not a particular function is invoked by a particular action. It should be a function that returns a boolean indicating whether or not to call the registered action. Below is the same pinch example, but the alert will only fire if the current minutes is even.

	```javascript
  	var ActionToFunctionMapping = {
  		ActionMappings:[{
		Topic: "RightHandThumbIndexPinch",
    		Source: "Input.Processed.Efficio",
      		ExecutionPrerequisite: function () {
			var date = new Date();
        		return date.getMinutes() % 2 === 0;
      		},
      		Action: function (data) {
        		alert("Pinch Detected in even minute!");
    		}
		}]
  	}
	```
	
	Once you are done creating your A2FM, make sure to include it in the html page you wish to enable under the Efficio references.

3. Create Efficio Configuration.

	Within the EFfficio configuration, the developer indicates which device(s) the application intends to use. Currently, the Efficio engine supports the following devices at the following levels:
  
  	<table>
    		<tr>
    			<th>Source</th>
    			<th>Support Level</th>
		</tr>
    		<tr>
        		<td>Leap Motion</td>
        		<td>Raw data + Gestures</td>
    		</tr>
    		<tr>
        		<td>Intel RealSense</td>
		        <td>Raw data + Limited Gestures</td>
    		</tr>
    		<tr>
        		<td>Microphone</td>
        		<td>Preset Commands</td>
    		</tr>
    		<tr>
        		<td>Accelerometer</td>
        		<td>Device Orientation</td>
    		</tr>
    		<tr>
        		<td>Geolocoation</td>
        		<td>Latitude and Longitude coordinates</td>
    		</tr>	
  	</table>

	To use the devices, fill out the following configuration:
	
	```javascript
		EfficioConfiguration = {
  			Devices: {
  				LeapMotion: false,
  				RealSense: false,
  				Microphone: false,
  				Orientation: false,
  				Location: false,
			}
		}
	```

	Set the device(s) that you wish to use to 'true'.  Finally, set the EfficioConfiguration.ActionToFunctionMapping property to the ActionToFunctionMapping object that you created in step 2. The final configuration should look like this:

	```javascript
	EfficioConfiguration = {
    	Devices: {
       		LeapMotion: false,
       		RealSense: false,
	       	Microphone: false,
			Orientation: false
			Location: false,	
	   	},

    	ActionToFunctionMapping: ActionToFunctionMapping
	}
	```

4. Load and Start Efficio.

	To load Efficio, use the require framework to load the JavaScript library.

	```javascript
	require(['scripts/EfficioIntegration/libs/Efficio.min.js'], function () {
		EfficioLoaded();
    })
	```

	Next, create a function called EfficioLoaded() that will handle when the Efficio library has been loaded.

	```javascript
	function EfficioLoaded() {
		if (!(typeof Efficio !== 'undefined' && Efficio.CheckReady())){
			 window.setTimeout(EfficioLoaded, 200);
        }
	}
	```

	Finally, if there is any additional checks that you must perform to confirm that your application is fully loaded, the Efficio.CheckReady() function accepts a function that returns a boolean to know whether or not the whole application is ready.

	```javascript
	var OtherReadyFunction = function (){
		// Checks if application is ready and returns a true or false
		return true;
	}
	function EfficioLoaded() {
		if (typeof Efficio === 'undefined' || !Efficio.CheckReady(OtherReadyFunction)){
			 window.setTimeout(EfficioLoaded, 200);
        }
	}
	```
