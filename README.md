# alpha_zero_othello
AlphaGoZeroの手法を用いてオセロの学習を行うプログラム。
FlaskでWebアプリケーションとしてWeb上で対局できるように。

Herokuにあがってるのでいつでも対局できます。（世代数２２０時点のモデル）
~~https://alphazerojk021.herokuapp.com/~~
メンテしてないので公開中止…。  
→代わりにDockerで起動できるようにしました。 

### Docker起動方法  
Imageのビルド  
`$ docker build -t othello_flask ./`  
Container起動  
`$ docker run --name othello_flask -p 80:80 -d othello_flask`