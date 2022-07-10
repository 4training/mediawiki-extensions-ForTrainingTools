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
				if (data.search('Success')) {
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
		//alert(JSON.stringify(postArgs, null, 4));
		mw.notify($('<p>Request sent. You should get a notification within a minute when the translated document is ready.<br/>Documentation: see <a href="/4training:Creating_and_Uploading_Files">Manual: Creating and Uploading Files</a></p>'), { title: 'Processing...', type: 'info'});
		$.post(mw.config.get('wgForTrainingToolsCorrectBotUrl'), postArgs)
			.done( function( data ) {
				if (data.search('Success')) {
					mw.notify($('<p>CorrectBot did TODO corrections and had TODO suggestions and warnings. Please check TODO</p>'), { title: 'Success!', type: 'info', autoHide: false});
				} else {
					mw.notify($('<p>CorrectBot failed. Please contact an administrator. Log:</p><p>' + data + '</p>'), { title: 'Error!', type: 'info', autoHide: false});
				}
			})
			.fail( function() {
				alert('Unkown error while trying to run CorrectBot! Please ask an administrator for help.');
			});
        e.preventDefault();
    } );


}() );
