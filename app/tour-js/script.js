
//initialize instance
var tour_instance = new EnjoyHint({});

//simple config.
//Only one step - highlighting(with description) "New" button
//hide EnjoyHint after a click on the button.
var tour_script_steps = [
    {
        "next #main_logo": 'Welcome to VachanOnline - The premier Bible study website in Indian languages!<br>If you are new here, we would like to give you a quick tour of what’s in store.<br>PS. We are still in the works, so keep coming back to check for updates.',
        shape : 'circle',
    },
    {
        "next #language2": 'Choose a Bible in your preferred language and version.'
    },
    {
        "next #book": 'Choose a bible book and a chapter to read.'
    },
    {
        "next #language4": 'Choose a Bible resource to study your chosen book or chapter.'
    },
    {
        "next #hindi_irv3": 'Click here to hear a related audio.',
        shape : 'circle',
        radius: 15
    },
    // {
    //     "next #image": 'Its Image'
    // },
    {
        "next #close": 'Click the \'<b>X</b>\' button to close a window.'
    },
    {
        "next #menu": 'Click this menu button for more links.',
        shape : 'circle',
        radius: 20
    },
    {
        "next #logo": 'Click this ‘VachanOnline’ heading to go back to default view.',
        shape : 'oval'
    }

];

//set script config
tour_instance.set(tour_script_steps);

//run Enjoyhint script
tour_instance.run();