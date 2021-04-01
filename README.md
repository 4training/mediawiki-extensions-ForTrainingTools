# ForTrainingTools extension
This MediaWiki extension adds custom functionality for the https://www.4training.net website.
Currently it has one feature:

## ODT-Generator
This extension adds a menu entry for logged-in users to start the ODT generator on worksheets
where it is available. This part is found in the includes/ subdirectory and is in PHP.
A JavaScript part (based on JQuery) is found in the resources/ subdirectory and handles user
interaction with this menu item: When a user clicks on it, this script sends a POST request
to the handler URL configured in `$wgForTrainingToolsGenerateOdtUrl`. It sends the following
parameters with it:
* `worksheet` (in the form of `page/languagecode`)
* `user` (the user name requesting the ODT generator; receives an email afterwards)

The actual work is found in a python repository with the CGI handler script and the script
doing the actual work.

# Installation and Configuration
Copy the extension files into `mediawiki/extensions/`

With git:
    `git clone https://github.com/4training/mediawiki-extensions-ForTrainingTools.git /PATH/TO/mediawiki/extensions/ForTrainingTools`

Add the following lines to `LocalSettings.php`:
```php
wfLoadExtension('ForTrainingTools');
# Configure handler URL for the generate ODT tool
$wgForTrainingToolsGenerateOdtUrl = 'https://www.example.org/cgi-bin/generateodt.py';
```

# See also
This extension is based on the BoilerPlate template for mediawiki extension development:
https://www.mediawiki.org/wiki/Extension:BoilerPlate

# TODO
Integrate test automation
