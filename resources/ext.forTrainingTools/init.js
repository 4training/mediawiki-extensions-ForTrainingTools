( function() {
	if (!mw.config.exists('wgForTrainingToolsGenerateOdtUrl') || !mw.config.get('wgForTrainingToolsGenerateOdtUrl')) {
		mw.notify('Missing configuration variable $wgForTrainingToolsGenerateOdtUrl. ODT-Generator not available.', { title: 'Error' })
		return;
	}
	if (!mw.config.exists('wgForTrainingToolsCorrectBotUrl') || !mw.config.get('wgForTrainingToolsCorrectBotUrl')) {
		mw.notify('Missing configuration variable $wgForTrainingToolsCorrectBotUrl. CorrectBot not available.', { title: 'Error' })
		return;
	}
    $( "#ca-generateodt a" ).on( 'click', function ( e ) {
        var postArgs = { worksheet: mw.config.get( 'wgPageName' ), user: mw.user.getName() };
		//alert(JSON.stringify(postArgs, null, 4));
		mw.notify($('<p>Request sent. You should get a notification within a minute when the translated document is ready.<br/>Documentation: see <a href="/4training:Creating_and_Uploading_Files">Manual: Creating and Uploading Files</a></p>'), { title: 'Processing...', type: 'info'});
		$.post(mw.config.get('wgForTrainingToolsGenerateOdtUrl'), postArgs)
			.done( function( data ) {
				if (data.indexOf('Success') > -1) {
					mw.notify($('<p>Request sent. The translated odt file will be available soon in the Dropbox. Please check it, finish all formatting and upload it into the system. Thank you very much!<br/>Documentation: see <a href="/4training:Creating_and_Uploading_Files">Manual: Creating and Uploading Files</a></p>'), { title: 'Success!', type: 'info', autoHide: false});
				} else {
					mw.notify($('<p>There was an error while trying to generate the ODT file. Please contact an administrator. Log:</p><p>' + data + '</p>'), { title: 'Error!', type: 'info', autoHide: false});
				}
			})
			.fail( function() {
				alert('Unkown error while trying to generate translated ODT file! Please ask an administrator for help.');
			});
        e.preventDefault();
    } );
    $( "#ca-correctbot a" ).on( 'click', function ( e ) {
        var postArgs = { page: mw.config.get( 'wgPageName' ) };
		mw.notify($("<p>CorrectBot is working hard to make the translation even better. " +
					"He's fast and should be finished within seconds, then you'll get another notification. " +
					"Thank you for your patience and all your work!</p>"), { title: 'Processing...', type: 'info'});
		$.post(mw.config.get('wgForTrainingToolsCorrectBotUrl'), postArgs)
			.done( function( data ) {
				var nothing_saved = data.indexOf('NOTHING SAVED.');
				if (nothing_saved > -1) {
					// CorrectBot didn't save anything. In the next line is the reason, let's get it
					var reason = data.substring(nothing_saved + 14).split(/\n/, 3)[1]
					mw.notify($('<p>' + reason + '<br/>' +
								'You may want to look at the <a href="/CorrectBot:' + mw.config.get( 'wgPageName' ) +
								'">previous CorrectBot report</a></p>'),
								{ title: 'Nothing saved!', type: 'info', autoHide: false});
				} else {
					// .* doesn't match newlines, so we use the workaround [\s\S]*
					var matches = data.match(/(\d+) correction[\s\S]*?(\d+) suggestion[\s\S]*?(\d+) warning/);
					if (matches != null) {
						mw.notify($('<p>CorrectBot did ' + matches[1] + ' corrections and had '
												         + matches[2] + ' suggestions and '
														 + matches[3] + ' warnings. ' +
									'Please check the <a href="/CorrectBot:' + mw.config.get( 'wgPageName' ) +
									'">CorrectBot report</a> for details.</p>'),
									{ title: 'Success!', type: 'info', autoHide: false});
					} else {
						mw.notify($('<p>CorrectBot failed. Please contact an administrator. Log:</p><p>' + data + '</p>'),
									{ title: 'Error!', type: 'info', autoHide: false});
					}
				}
			})
			.fail( function() {
				alert('Unkown error while trying to run CorrectBot! Please ask an administrator for help.');
			});
        e.preventDefault();
    } );


}() );
