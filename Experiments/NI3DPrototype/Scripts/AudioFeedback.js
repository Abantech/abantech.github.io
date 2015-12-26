var sound = new Audio('http://ie.microsoft.com/testdrive/Graphics/IEBeatz/assets/sounds/mp3/effect.mp3');
var bass = new Audio('http://ie.microsoft.com/testdrive/Graphics/IEBeatz/assets/sounds/mp3/bonga.mp3');

function playAudioFeedback(type)
{
    if(type === "bass")
    {
        bass.play();
    }
    else
    {
        sound.play();
    }

}