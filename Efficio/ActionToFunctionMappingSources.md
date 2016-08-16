Action To Function Mapping (A2FM) Events
========================================
The Action to Function Mapping is how the Efficio engine knows which functions to invoke when a certain action is performed. The purpose of this document is to describe how to subscribe to events and what events are available to a developer.

Table of Contents
-----------------
1. [How To Subscribe](#How-To-Subscribe)
1. [Audio Commands](#Audio-Commands)
1. [Efficio Events](#Efficio-Events)
1. [Raw Sensor Data](#Raw-Sensor-Data)
1. [Single Hand Positions](#Single-Hand-Positions)


##How to Subscribe
The A2FM object is how all actions are wired up to invoke functions. Below is an empty A2FM object:

```javascript
ActionToFunctionMapping = {
	AudioCommands: {
    },
    "ActionMappings": [{
	}]
}
```

Within the A2FM object, a developer can make 0 or more entries within the 'AudioCommands' or  'ActionMappings' properties.  Additional details about wiring up audio commands can be found [here](#Audio-Commands).   

To wire up an action to function mapping, a developer must add an entry to the 'ActionMapping' property.  In generall the ActionMapping entry has the following format:

```javascript
{
	Topic: "Topic",
	Source: "Source",
	Action: function (data) {
	}
}
```

The source of the object is the channel the A2FM will be listening on.  The topic is what particular event it will be looking for on that channel. The action is what the application will do once that event fires. For example, if the application is running a Leap Motion, all of the raw Leap Motion data is accessible using the following A2FM entry:

```javascript
{
	Topic: "Leap",
	Source: "Input.Raw.Human",
	Action: function (data) {
		// Do something with raw Leap Motion data here
	}
}
```

As another example, all raw RealSense hand data is available here:

```javascript
{
	Topic: "RealSense",
	Source: "Input.Raw.Human",
	Action: function (data) {
		// Do something with raw Realsense data here
	}
}
```

If you want to use both within the same application to render hands, you can have the following A2FM:

```javascript
ActionToFunctionMapping = {
	AudioCommands: {
    },
    "ActionMappings": [
	{
		Topic: "Leap",
		Source: "Input.Raw.Human",
		Action: function (data) {
			// Do something with raw Leap Motion data here
		}
	},
	{
		Topic: "RealSense",
		Source: "Input.Raw.Human",
		Action: function (data) {
			// Do something with raw Realsense data here
		}
	}]
}
```

In all further descriptions, know that Source denotes the source property and Topic denotes the Topic property, that the Action is implied in the mapping, and that the Data section describes the 'data' argument of the Action receives.

##Audio Commands

The Efficio engine also supports the use of Audio Commands, which are hooked up slightly differently than other events. To hook up audio events, add a new property under the AudioCommands property of the particular phrase you are looking for. As the value of that phrase, set the function you wish to execute. Below is an example of a program looking for the 'Restart' command, which will make the window reload:

```javascript
ActionToFunctionMapping = {
	AudioCommands: {
		"Restart": function (){
			window.reload();
    },
    "ActionMappings": [{
	}]
}
```

##Efficio Events

The Efficio engine will also have internal events to which the developer can subscribe.  Right now, the only available event is the Efficio.Ready event, which is fired once the Efficio engine and the application is ready.  Below is the signature to subscribe to the events:

```javascript
{
	Source: "Efficio
	Topic: "Ready"
	Action: function(){
	}
}
```

##Raw Sensor Data
1. Accelerometer
	<pre>
	Source:	'Input.Raw.Device'
	Topic:	'Device Orientation'
	Data:
		TrackingType:	'Orientation'
		GestureInformation:	Raw sensor data
	
	
	Source:	'Input.Raw.Device'
	Topic:	'Orientation Change'
	Data:
		TrackingType:		'Orientation'
		GestureInformation:	Raw sensor data
	</pre>

1. Geolocation
	<pre>
	Source:	'Input.Raw.Device'
	Topic:	'Location'
	Data:
		TrackingType:	'Location'
		GestureInformation:	Raw sensor data
	</pre>

1. Intel Realsense Hands
	<pre>
	Source:	Input.Raw.Human
	Topic:	RealSense
	Data:
		TrackingType:	'Hands'
		Input:		All data from the sensor
		Hands:		Hand data from the sensor
	</pre>

1. Leap Motion Hands
	<pre>
	Source:	Input.Raw.Human
	Topic:	Leap
	Data:
		TrackingType:	'Hands'
		Frame:		Contains the Leap Motion frame object.
		Controller:		Contains the Leap Motion controller object.
		Hands:		Contains the Leap Motion hands object.
	</pre>

##Single Hand Positions

1. 