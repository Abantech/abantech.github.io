define(function () {
    var ActiveGesturesDictionary = {}

    function GetActiveGestureDictionary() {
        if (!ActiveGesturesDictionary) {
            ActiveGesturesDictionary == {};
        }

        return ActiveGesturesDictionary;
    }

    function RetrieveEntry(gestureName, dictionary, side) {
        var entry;
        var agd = GetActiveGestureDictionary();

        if (dictionary) {
            if (!agd[dictionary]) {
                agd[dictionary] = {};
            }

            if (side) {
                if (!agd[dictionary][side]) {
                    agd[dictionary][side] = {};
                }

                entry = agd[dictionary][side][gestureName];
            }
            else {
                entry = agd[dictionary][gestureName];
            }
        }
        else {
            entry = agd[gestureName];
        }

        return entry;
    }

    function AddEntry(entry, gestureName, dictionary, side){
        var agd = GetActiveGestureDictionary();

        if (dictionary) {
            if (side) {
                agd[dictionary][side][gestureName] = entry;
            }
            else {
                agd[dictionary][gestureName] = entry;
            }
        }
        else {
            agd[gestureName] = entry;
        }
    }

    function CreateOrUpdateEntry(gestureName, dictionary, side) {
        var entry = RetrieveEntry(gestureName, dictionary, side);

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

            AddEntry(entry, gestureName, dictionary, side);
        }
        else {
            entry.FireCount++;
        }

        return entry;
    }

    function DeleteEntry(gestureName, dictionary, side) {
        var agd = GetActiveGestureDictionary();

        if (dictionary) {
            if (agd[dictionary]) {
                if (side) {
                    if (agd[dictionary][side]) {
                        if (gestureName) {
                            agd[dictionary][side][gestureName] = null;
                        }
                        else {
                            agd[dictionary][side] = null;
                        }
                    }
                }
                else {
                    if (gestureName) {
                        agd[dictionary][gestureName] = null;
                    }
                    else {
                        agd[dictionary] = null;
                    }
                }
            }
        }
        else {
            agd[gestureName] = null;
        }
    }

    return {
        GetActiveGesturesDictionary: GetActiveGestureDictionary,
        CreateOrUpdateEntry: CreateOrUpdateEntry,
        RetrieveEntry: RetrieveEntry,
        DeleteEntry: DeleteEntry
    }
});