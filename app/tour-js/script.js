
//initialize instance
var tour_instance = new EnjoyHint({});

//simple config.
//Only one step - highlighting(with description) "New" button
//hide EnjoyHint after a click on the button.
var tour_script_steps = [
    {
        "next #logo": '<p>Welcome to VachanOnline - the premier Bible study website in Indian languages! <br>If you are new here, we would like to give you a quick tour of what’s in store.</p><p><span style="font-size:20px">वचनऑनलाइन में आपका स्वागत है - यह भारतीय भाषाओं में बाइबल अध्ययन करने का प्रमुख वेबसाइट है! <br>यदि आप इस वेबसाइट पर नए हैं तो हम आपको इसमें सम्मलित विषयों से अवगत कराना चाहते हैं।<br></span></p>'
    },
    {
        "next #language2": 'Choose a Bible in your preferred language or version.<br><span style="font-size:20px">अपनी पसंदीदा भाषा या संस्करण में बाइबल चुनें।</span>'
    },
    {
        "next #book": 'Choose a Bible book and a chapter to read.<br><span style="font-size:20px">अध्ययन के लिए बाइबल की कोई पुस्तक और उसका अध्याय चुनें।</span>'
    },
    {
        "next #language4": 'Choose a Bible resource to study your chosen book or chapter.<br><span style="font-size:20px">अपनी चुनी पुस्तक या अध्याय का अध्ययन करने के लिए बाइबल संसाधनों को चुनें।</span>'
    },
    {
        "next #hindi_irv_infographics": '<p>Let’s make your VachanOnline experience more exciting!<br>Click on an image icon <span class="header-icon image-icon"/> to see a related image.</p><p><span style="font-size:20px">आओ आपके वचनऑनलाइन के अनुभव को और अधिक रोमांचक बनाते हैं!<br>संबंधित चित्र को देखने के लिए चित्र आइकॉन <span class="header-icon image-icon"/> पर क्लिक करें।</span></p>',
    },
    {
        "next #hindi_irv3": 'Click on an audio icon <span class="header-icon audio-button"/> to hear a related audio.<br><span style="font-size:20px">संबंधित ऑडियो सुनने के लिए ऑडियो आइकॉन <span class="header-icon audio-button"/> पर क्लिक करें।</span>',
        shape : 'circle',
        radius: 15
    },
    {
        "next #hindi_irv_video": 'Click on a video icon <span class="header-icon video-button"/> to see a related video.<br><span style="font-size:20px">संबंधित वीडियो देखने के लिए वीडियो आइकॉन <span class="header-icon video-button"/> पर क्लिक करें।</span>',
        shape : 'circle',
        radius: 15
    },
    {
        "next #close": 'Click the \'<b>X</b>\' button to close a window.<br><span style="font-size:20px">विंडो को बंद करने के लिए \'<b>X</b>\' बटन पर क्लिक करें।</span>'
    },
    {
        "next #menu": 'Click the menu icon for more links.<br><span style="font-size:20px">अधिक विकल्पों के लिए सूची आइकॉन पर क्लिक करें।</span>',
        shape : 'circle',
        radius: 20
    },
    {
        "next #logo": '<p>Click on this VachanOnline title to go back to the default view.<br>We are still in the works, so keep coming back to check for updated content.</p><p><span style="font-size:20px">डिफ़ॉल्ट (मूल) दृश्य पर वापस जाने के लिए वचनऑनलाइन शीर्षक पर क्लिक करें।<br>इस वेबसाइट का कार्य प्रगति पर है इसलिए नवीनतम विषयों के लिए हमारे साथ बने रहें।</span></p>'
    }

];

//set script config
tour_instance.set(tour_script_steps);

//run Enjoyhint script
tour_instance.run();