# install cocos2d-js
- SDK download: http://cn.cocos2d-x.org/download/
- install python: brew install python
- unzip sdk, then python setup.py

# init workspace env add cocos2d-js framework into dir
- cocos new -l js tetris-html5-temp
- cp -rf tetris-html5-temp/frameworks tetris-html5/
- rm -rf tetris-html5-temp

# debug
cd tetris-html5 & sh run.sh

# publish
