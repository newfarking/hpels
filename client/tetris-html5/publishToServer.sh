cocos compile -p web -m release
cp -r publish/html5/* ../../server/hpels-server/hpels-server-web/src/main/resources/static/
mv ../../server/hpels-server/hpels-server-web/src/main/resources/static/index.html ../../server/hpels-server/hpels-server-web/src/main/resources/templates/index.vm

