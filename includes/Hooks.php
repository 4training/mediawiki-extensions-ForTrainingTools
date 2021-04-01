<?php
/**
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * @file
 */

namespace MediaWiki\Extension\ForTrainingTools;

class Hooks {

	/**
	 * Make our custom configuration variables available in JavaScript
	 */
	public static function onResourceLoaderGetConfigVars(array &$vars) {
		global $wgForTrainingToolsGenerateOdtUrl;

		if (isset($wgForTrainingToolsGenerateOdtUrl)) {
			$vars['wgForTrainingToolsGenerateOdtUrl'] = $wgForTrainingToolsGenerateOdtUrl;
		}
	
		return true;
	}

	/**
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/SkinTemplateNavigation
	 * Add an extra "ODT-Generator" navigation item to the navigation bar for logged in users
	 */
	public static function onSkinTemplateNavigation(\SkinTemplate $skinTemplate, array &$links ) {
		global $wgRequest, $wgUser;
		$title = $skinTemplate->getTitle();
		if ( $title->getNamespace() !== NS_SPECIAL && $wgUser->isLoggedIn()) {
			$pos = strpos($title, '/');
			if ($pos === false)		// we're on the English original of a page (e.g. 'Prayer') -> don't show the option at all
				return true;
			$languagecode = substr($title, $pos + 1);
			$worksheet = substr($title, 0, $pos);

			// Only display this option if there is an odt file linked to the page
			$templates = $title->getTemplateLinksFrom();
			$hasOdt = false;
			foreach ($templates as $template) {
				if ($template->getText() === "OdtDownload") {
					$hasOdt = true;
					break;
				}
			}
			if (!$hasOdt)
				return true;

			$allowed = array("God's Story (five fingers)", "God's Story (first and last sacrifice)", 'Baptism',
				'Prayer', 'Forgiving Step by Step', 'Confessing Sins and Repenting', 'Time with God', 'Hearing from God',
				'Family and our Relationship with God', 'Worksheet for the Book of Acts',
				'Training Meeting Outline', 'Overcoming Fear and Anger', 'Getting Rid of Colored Lenses',
				'Church', 'Healing', 'My Story with God', 'Bible Reading Bookmark (Seven Stories full of Hope)',
				'Bible Reading Bookmark', 'Bible Reading Bookmark (Starting with the Creation)', 'A Daily Prayer',
				'The Role of a Helper in Prayer');	// Only enable the function for these worksheets (temporary, TODO)*/
			if (!in_array($worksheet, $allowed))
				return true;
				
			// important: load our javascript class
			$skinTemplate->getOutput()->addModules( 'ext.forTrainingTools' );

			$links['actions']['generateodt'] = array(
				'text' => wfMessage( 'generateodt' )->text(),
				'href' => $title
			);
		}

		return true;


	}

}
