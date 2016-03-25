SET TARGET=..\samsung.ui.js
SET PATH_UI=..\ui\
SET BLANK_TXT=merge_blank.txt
COPY /b /y %PATH_UI%ui.message.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.manager.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.common.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.nav.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.accordion.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.filter.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.flick.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.globalsearch.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.jump.basic.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.jump.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.layer.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.layer.common.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.layer.video.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.popup.js + %BLANK_TXT% %TARGET%
COPY /b /y %TARGET% + %PATH_UI%ui.personalhistory.js + %BLANK_TXT% %TARGET%

SET PATH_UI=..\

JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.jquery.js -o samsung.jquery.js --charset utf-8
JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.util.js -o samsung.util.js --charset utf-8
JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.ui.js -o samsung.ui.js --charset utf-8
JAVA -jar yuicompressor-2.4.8.jar %PATH_UI%samsung.common.js -o samsung.common.js --charset utf-8