var fs = require('fs')
var path = require('path')

var indexTemplateHtmlPath = path.resolve(__dirname, 'template', 'index-template.html')
var indexTemplateHtml = fs.readFileSync(indexTemplateHtmlPath, 'utf-8')

module.exports = function generateMainPage(comicObjects) {
	var rssFeedList = comicObjectsToHtml(comicObjects)
	var suggestedComicObjects = comicObjects.filter(function (comicObject) {
		return [
			'calvinandhobbes',
			'foxtrot',
			'foxtrotclassics',
			'peanuts',
			'pearlsbeforeswine',
			'dilbert-classics'
		].indexOf(comicObject.basename) !== -1
	})
	var suggestedPages = suggestedComicsToHtml(suggestedComicObjects)
	var todaysDate = new Date().toDateString()
	
	return indexTemplateHtml
		.replace('<!-- SUGGESTED PAGES -->', suggestedPages)
		.replace('<!-- RSS FEED LIST -->', rssFeedList)
		.replace('<!-- DATE GENERATED -->', todaysDate)
}

function suggestedComicsToHtml(suggestedComicObjects) {
	return suggestedComicObjects.map(function (comicObject) {
		return `
			<a href="./preview/${encodeURI(comicObject.basename)}" class="suggested-item">
				<img src="./static/suggested/resized/${comicObject.basename}.jpg">
				<span class="title-and-author">
					<div class="title">${comicObject.titleAndAuthor.split(' by ')[0]}</div>
					<div class="author">by ${comicObject.titleAndAuthor.split(' by ')[1]}</div>
				</span>
			</a>
			`.trim()
	}).join('')
}

function comicObjectsToHtml(comicObjects) {
	return '<ul id="comics-list">' +
	comicObjects
		.filter(Boolean)
		.map(function (comicObject) {
			return `
				<li data-search="${comicObject.titleAndAuthor.toLowerCase()}">
					<a href="./preview/${encodeURI(comicObject.basename)}" class="comic-title">${comicObject.titleAndAuthor}</a>
				</li>`.replace(/^\t{4}/mg, '')
		})
		.sort()
		.join('\n') +
	'</ul>'
}
