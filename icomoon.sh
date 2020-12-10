unzip -o ~/Downloads/icomoon.zip style.css -d ./src/statics/icomoon
unzip -o ~/Downloads/icomoon.zip fonts/icomoon.woff -d ./src/statics/icomoon
unzip -o ~/Downloads/icomoon.zip selection.json -d ./src/statics/icomoon
sed -i '5s/,/;/' ./src/statics/icomoon/style.css
sed -i '4d' ./src/statics/icomoon/style.css
sed -i '5d' ./src/statics/icomoon/style.css

