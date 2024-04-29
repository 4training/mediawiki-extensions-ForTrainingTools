# ForTrainingTools extension
This MediaWiki extension adds custom functionality for the https://www.4training.net website.
Currently it adds two menu entries for logged-in users to start tools on worksheet translations.
This part is found in the includes/ subdirectory and is in PHP.
A JavaScript part (based on JQuery) is found in the resources/ subdirectory and handles user
interaction with these menu items: When a user clicks on one, the script sends a POST request
to the handler URLs configured in `LocalSettings.php`.

These requests are handled by CGI scripts calling the scripts doing the actual work.
They are implemented in Python and can be found in `https://github.com/4training/pywikitools`

## ODT-Generator
Configuration variable for the handler URL: `$wgForTrainingToolsGenerateOdtUrl`.
It sends the following parameters with it:
* `page` (in the form of `worksheet/languagecode`)
* `user` (the user name requesting the ODT generator; receives an email afterwards)

## CorrectBot
Configuration variable for the handler URL: `$wgForTrainingToolsCorrectBotUrl`.
It sends the following parameters with it:
* `page` (in the form of `worksheet/languagecode`)

# Installation and Configuration
Copy the extension files into `mediawiki/extensions/`

With git:
    `git clone https://github.com/4training/mediawiki-extensions-ForTrainingTools.git /PATH/TO/mediawiki/extensions/ForTrainingTools`

Add the following lines to `LocalSettings.php`:
```php
wfLoadExtension('ForTrainingTools');
# Configure handler URLs for the tools
$wgForTrainingToolsGenerateOdtUrl = 'https://www.example.org/cgi-bin/generateodt.py';
$wgForTrainingToolsCorrectBotUrl = '/cgi-bin/correctbot.py';
```

# See also
This extension is based on the BoilerPlate template for mediawiki extension development:
https://www.mediawiki.org/wiki/Extension:BoilerPlate

# TODO
Integrate test automation
