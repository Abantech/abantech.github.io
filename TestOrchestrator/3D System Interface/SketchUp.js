function Extrude(data){
    console.log("Extrude Called");
    return 'Extruded Asset';
};

function Translate(data) {
    console.log("Translate Called");
    return 'Translated Asset';
};

function Create(data) {
    console.log("Create Called");
    return 'Created Asset';
};

module.exports = {
    Extrude: Extrude,
    Translate: Translate,
    Create: Create
}