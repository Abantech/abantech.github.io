Test = {
	a: function(data){
		
	}
}

ActionToFunctionMapping = {
    "Bridge": "Test",
    "ActionMappings": [{
        Topic: "RawOrientationData",
        Source: "Input.Processed.Efficio.Device",
        Action: "a",
		FireRestrictions: {
			FireOnce: true,
			FireAfterXFrames: 10
		},
		Arguments: [{
			Source: "Data",
			Name: "DataValue",
			MapTo: "FunctionValue"
		}]
	}]
}