SET PATH_UI=..\

JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.jquery.js -o samsung.jquery.js --charset utf-8
JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.util.js -o samsung.util.js --charset utf-8
JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.ui.js -o samsung.ui.js --charset utf-8
JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.common.js -o samsung.common.js --charset utf-8