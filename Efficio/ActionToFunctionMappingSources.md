Action To Function Mapping (A2FM) Events
========================================
The Action to Function Mapping is how the Efficio engine knows which functions to invoke when a certain action is performed. The purpose of this document is to describe how to subscribe to events and what events are available to a developer.

Table of Contents
-----------------
1. [How To Subscribe](#how-to-subscribe)
1. [Audio Commands](#audio-commands)
1. [Efficio Events](#efficio-events)
1. [Raw Sensor Data](#raw-sensor-data)
1. [Single Hand Positions](#single-hand-positions)
1. [Two Hand Positions](#two-hand-positions)


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
	Source: "Efficio"
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

1. [Side]HandDetected

	Fires when a hand is detected in the frame. [Side] can have values of either 'Left' or 'Right', generating two events: 
	* LeftHandDetected
	* RightHandDetected
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandDetected
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]Hand[Count]FingersExtended

	Fires each frame that has a hand, indicating how many fingers are extended. [Side] can have values of either 'Left' or 'Right'. [Count] can have values of 'Zero', 'One', 'Two', 'Three', 'Four', or 'Five', generating a total of 12 combinations of [Side] and [Count]. Below is a list of all the possible combinations:
	* RightHandZeroFingersExtended
	* RightHandOneFingersExtended
	* RightHandTwoFingersExtended
	* RightHandThreeFingersExtended
	* RightHandFourFingersExtended
	* RightHandFiveFingersExtended
	* LeftHandZeroFingersExtended
	* LeftHandOneFingersExtended
	* LeftHandTwoFingersExtended
	* LeftHandThreeFingersExtended
	* LeftHandFourFingersExtended
	* LeftHandFiveFingersExtended
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]Hand[Count]FingersExtended
	Data:
		Input:			The full sensor data
		Hand:			The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
		ExtededFingers:		An array of the indicies of the extended fingers, where:
								0 indicates 'Thumb', 
								1 indicates 'Index', 
								2 indicates 'Middle', 
								3 indicates 'Ring',
								and 4 indicates 'Pinky'
	</pre>

1. [Side]Hand[Finger]Extended
	
	Fires each frame that has a hand, indicating how which fingers are extended. [Side] can have values of either 'Left' or 'Right'. [Finger] can have values of 'Thumb', 'Index', 'Middle', 'Ring', or 'Pinky', generating a total of 10 combinations of [Side] and [Finger]. Below is a list of all the possible combinations. Note that more than one of these can be fired each frame.
	* RightHandThumbFingerExtended
	* RightHandIndexFingerExtended
	* RightHandMiddleFingerExtended
	* RightHandRingFingerExtended
	* RightHandPinkyFingerExtended
	* LeftHandThumbFingerExtended
	* LeftHandIndexFingerExtended
	* LeftHandMiddleFingerExtended
	* LeftHandRingFingerExtended
	* LeftHandPinkyFingerExtended
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]Hand[Finger]Extended
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
		Finger:		The name of the extended finger
	</pre>

1. [Side]HandFlexion

	Fires when the indicated hand is flexed. [Side] can have values of either 'Left' or 'Right', generating two events: 
	* LeftHandFlexion
	* RightHandFlexion
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandFlexion
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]HandExtension

	Fires when the indicated hand is extended. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftHandExtension
	* RightHandExtension
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandExtension
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]HandRadialDeviation

	Fires when the indicated hand is deviated radialy. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftHandRadialDeviation
	* RightHandRadialDeviation
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandRadialDeviation
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]HandUlnarDeviation

	Fires when the indicated hand is deviated toward the Ulna. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftHandUlnarDeviation
	* RightHandUlnarDeviation
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandUlnarDeviation
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]HandSupenation

	Fires when the indicated hand is supine. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftHandSupenation
	* RightHandSupenation
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandSupenation
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]HandPronation

	Fires when the indicated hand is prone. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftHandPronation
	* RightHandPronation
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandPronation
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]HandNeutral

	Fires when the indicated hand is neither prone nor supine. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftHandNeutral
	* RightHandNeutral
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandNeutral
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]Hand[Finger1][Finger2]Pinch

	Fires when a pinch is detected by two fingers on the same hand. [Side] can have values of either 'Left' or 'Right'. Finger1 can have the values of 'Thumb', 'Index', 'Middle', or 'Ring'. Finger2 can have values of 'Index', 'Middle', 'Ring', or 'Pinky'. The following are all the possible events that can be fired:
	* RightHandThumbIndexPinch
	* RightHandThumbMiddlePinch
	* RightHandThumbRingPinch
	* RightHandThumbPinkyPinch
	* RightHandIndexMiddlePinch
	* RightHandIndexRingPinch
	* RightHandIndexPinkyPinch
	* RightHandMiddleRingPinch
	* RightHandMiddlePinkyPinch
	* RightHandRingPinkyPinch
	* LeftHandThumbIndexPinch
	* LeftHandThumbMiddlePinch
	* LeftHandThumbRingPinch
	* LeftHandThumbPinkyPinch
	* LeftHandIndexMiddlePinch
	* LeftHandIndexRingPinch
	* LeftHandIndexPinkyPinch
	* LeftHandMiddleRingPinch
	* LeftHandMiddlePinkyPinch
	* LeftHandRingPinkyPinch
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]HandNeutral
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. [Side]ThumbsUp

	Fires when the hand is neutral and the thumb is the only extended finger. [Side] can have values of either 'Left' or 'Right', generating two events:
	* LeftThumbsUp
	* RightThumbsUp
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	[Side]ThumbsUp
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

##Two Hand Positions

1. BothHandsNeutral

	Fired when both hands are in a neutral position.
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	BothHandsNeutral
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>

1. BothHandsPronation

	Fired when both hands are in a prone position.
	<pre>
	Source:	Input.Processed.Efficio
	Topic:	BothHandsPronation
	Data:
		Input:	The full sensor data
		Hand:	The hand for which the position was detected
		GestureInformation:	Additional information for the gesture
	</pre>