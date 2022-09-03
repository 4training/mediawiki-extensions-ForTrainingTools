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
		global $wgForTrainingToolsGenerateOdtUrl, $wgForTrainingToolsCorrectBotUrl;

		if (isset($wgForTrainingToolsGenerateOdtUrl)) {
			$vars['wgForTrainingToolsGenerateOdtUrl'] = $wgForTrainingToolsGenerateOdtUrl;
		}

		if (isset($wgForTrainingToolsCorrectBotUrl)) {
			$vars['wgForTrainingToolsCorrectBotUrl'] = $wgForTrainingToolsCorrectBotUrl;
		}

		return true;
	}

	/*
	 * TODO: Is this the best hook to use for adding the CSP header?
	 * At least it works - TODO: don't have the URL in here but get it from the configuration variable
	 * This is necessary for better security: generally have $wgCSPHeaders, but for the ODT generator this needs to be added
	 * -> TODO: only show this when user is logged in (ideally only when it's a translated content page, see below)
	 *
	 * And then add into LocalSettings.php:
	 * $wgCSPHeader = [
	 *    'default-src' => [],
	 *    'script-src' => []
	 * ];
	 */
	public static function onRequestContextCreateSkin( $context ) {
		$context->getOutput()->getCSP()->addDefaultSrc('www.trainingfuertrainer.de');
	}

	/**
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/SkinTemplateNavigation
	 * Add extra "ODT-Generator" and "CorrectBot" navigation items to the navigation bar for logged in users
	 */
	public static function onSkinTemplateNavigation(\SkinTemplate $skinTemplate, array &$links ) {
		global $wgRequest, $wgUser;
		// TODO this doesn't work, apparently we're too late here already
//		$skinTemplate->getOutput()->getCSP()->addDefaultSrc('www.trainingfuertrainer.de');
		$title = $skinTemplate->getTitle();
		if ( $title->getNamespace() !== NS_SPECIAL && $wgUser->isLoggedIn()) {
			$pos = strpos($title, '/');
			if ($pos === false)		// we're on the English original of a page (e.g. 'Prayer') -> don't show the option at all
				return true;
			$languagecode = substr($title, $pos + 1);
			$worksheet = substr($title, 0, $pos);

			// Only display this option if there is an odt or odg file linked to the page
			$templates = $title->getTemplateLinksFrom();
			$hasOd = false;
			foreach ($templates as $template) {
				if (in_array($template->getText(), ["OdtDownload", "OdgDownload"])) {
					$hasOd = true;
					break;
				}
			}
			if (!$hasOd)
				return true;

			// important: load our javascript class
			$skinTemplate->getOutput()->addModules( 'ext.forTrainingTools' );

			$links['actions']['generateodt'] = array(
				'text' => wfMessage( 'generateodt' )->text(),
				'href' => $title
			);
			$links['actions']['correctbot'] = array(
				'text' => wfMessage('correctbot')->text(),
				'href' => $title
			);
		}

		return true;


	}

}
