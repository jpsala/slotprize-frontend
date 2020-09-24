host=slotoprizes.tagadagames.com
chmod 755 dist -R
rm -f dist.bz2
echo compress
tar --create --bzip --verbose --file dist.bz2 dist/spa/
# > /dev/null 2>&1
echo scp
scp dist.bz2 $host:/tmp
echo ssh 'rm -rf /prg/front/dist/* ; tar -jxvf /tmp/dist.bz2 -C /prg/front > /dev/null 2>&1 ; chmod 755 /prg/front/dist -R'
ssh $host 'rm -rf /prg/front/dist/* ; tar -jxvf /tmp/dist.bz2 -C /prg/front > /dev/null 2>&1 ; chmod 755 /prg/front/dist -R'
rm -f dist.bz2
echo Listo
