define(function () {
    var ActiveGesturesDictionary = {}

    //function RetrieveEntry(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function RetrieveEntry(trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            var dictionaries = [];

            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        if (!gestureName) {
            console.error('gestureName argument required.');
        }

        if (!ActiveGesturesDictionary[trackingType]) {
            ActiveGesturesDictionary[trackingType] = {};
        }

        var path = ActiveGesturesDictionary[trackingType];

        if (dictionaries) {
            var dictLength = dictionaries.length;

            for (var i = 0; i < dictLength; i++) {
                if (!path[dictionaries[i]]) {
                    path[dictionaries[i]] = {};
                }

                path = path[dictionaries[i]];
            }
        }

        return path[gestureName];
    }

    //function AddEntry(entry, trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function AddEntry(entry, trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';

        if (!gestureName) {
            console.error('gestureName argument required.');
        }

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 3) {
            var dictionaries = [];

            for (var i = 3; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        if (!ActiveGesturesDictionary[trackingType]) {
            ActiveGesturesDictionary[trackingType] = {};
        }

        var path = ActiveGesturesDictionary[trackingType];

        if (dictionaries) {
            var dictLength = dictionaries.length;

            for (var i = 0; i < dictLength; i++) {
                if (!path[dictionaries[i]]) {
                    path[dictionaries[i]] = {};
                }

                path = path[dictionaries[i]];
            }
        }

        path[gestureName] = entry;
    }

    //function CreateOrUpdateEntry(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function CreateOrUpdateEntry(trackingType, gestureName) {

        // Get all subdictionaries; workaround for '...' not being supported
        var dictionaries = [];
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        var retrieveVars = [trackingType, gestureName].concat(dictionaries);

        var entry = RetrieveEntry.apply(null, retrieveVars);

        if (!entry) {
            entry = {
                // Time properties
                StartTime: new Date(),
                EndTime: null,
                GestureDuration: function () {
                    var endTime = this.EndTime || new Date();

                    return Math.abs(this.StartTime - endTime)
                },

                // Fire count properties
                FireCount: 0,
                FirstFire: function () { return this.FireCount === 0 }
            }

            var addVars = [entry].concat(retrieveVars);
            AddEntry.apply(null, addVars);
        }
        else {
            entry.FireCount++;
        }

        return entry;
    }

    //function DeleteEntry(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function DeleteEntry(trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';
        var toDelete;

        if (!ActiveGesturesDictionary[trackingType]) {
            return;
        }

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            var dictionaries = [];

            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        var toDelete = ActiveGesturesDictionary;

        if (dictionaries) {
            var lastEntry;
            var dictLength = dictionaries.length;
            toDelete = toDelete[trackingType];

            for (var i = 0; i < dictLength; i++) {
                if (!toDelete[dictionaries[i]]) {
                    return;
                }

                if (!(i === dictLength - 1)) {
                    toDelete = toDelete[dictionaries[i]];
                }
                else {
                    lastEntry = dictionaries[i];
                }
            }
        }
        else {
            lastEntry = trackingType;
        }

        if (gestureName && toDelete) {
            delete toDelete[lastEntry][gestureName];
        }
        else {
            delete toDelete[lastEntry];
        }
    }

    //function DeleteAllBut(trackingType, gestureName, ...dictionary) { '...' is not supported yet
    function DeleteAllBut(trackingType, gestureName) {
        trackingType = trackingType || 'NoTrackingType';

        if (!ActiveGesturesDictionary[trackingType]) {
            return;
        }

        if (!gestureName) {
            throw Exception('gestureName argument required.');
        }

        // Get all subdictionaries; workaround for '...' not being supported
        var argumentsLength = arguments.length;
        if (argumentsLength > 2) {
            var dictionaries = [];

            for (var i = 2; i < argumentsLength; i++) {
                dictionaries.push(arguments[i]);
            }
        }

        var toDelete = ActiveGesturesDictionary[trackingType];

        if (dictionaries) {
            var dictLength = dictionaries.length;

            for (var i = 0; i < dictLength; i++) {
                if (!toDelete[dictionaries[i]]) {
                    return;
                }

                toDelete = toDelete[dictionaries[i]];
            }
        }

        for (var prop in toDelete) {
            if (prop != gestureName) {
                delete toDelete[prop];
            }
        }
    }

    return {
        ActiveGesturesDictionary: ActiveGesturesDictionary,
        CreateOrUpdateEntry: CreateOrUpdateEntry,
        RetrieveEntry: RetrieveEntry,
        DeleteEntry: DeleteEntry,
        DeleteAllBut: DeleteAllBut
    }
});