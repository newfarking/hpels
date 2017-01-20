# install cocos2d-js
1. SDK download: http://cn.cocos2d-x.org/download/
2. install python: brew install python
3. unzip sdk, then python setup.py

# init workspace env add cocos2d-js framework into dir
cd ./
cocos new -l js tetris-html5-temp
cp -rf tetris-html5/* tetris-html5-temp/
mv tetris-html5-temp tetris-html5

# debug
cd tetris-html5 & sh run.sh

# publish
