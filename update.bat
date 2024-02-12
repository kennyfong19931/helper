@REM 需要注意續集同ID: abema, netfilx, disneyplus, bilibili, muse_hk, ani_one, ani_one_asia

echo ">>> nicovideo"
call npm run bdh hokan nicovideo
echo ">>> unext"
call npm run bdh hokan unext
echo ">>> abema"
call npm run bdh hokan abema
echo ">>> muse_hk"
call npm run bdh hokan muse_hk
echo ">>> ani_one"
call npm run bdh hokan ani_one
echo ">>> ani_one_asia"
call npm run bdh hokan ani_one_asia
echo ">>> viu"
call npm run bdh hokan viu
echo ">>> netflix"
call npm run bdh hokan netflix
echo ">>> mytv"
call npm run bdh hokan mytv
echo ">>> disneyplus"
call npm run bdh hokan disneyplus
echo ">>> nowPlayer"
call npm run bdh hokan nowPlayer
@REM echo ">>> bilibili"
@REM call npm run bdh hokan bilibili
echo ">>> bilibili_hk_mo_tw"
call npm run bdh hokan bilibili_hk_mo_tw
echo ">>> bilibili_hk_mo"
call npm run bdh hokan bilibili_hk_mo
@REM echo ">>> bilibili_tw"
@REM call npm run bdh hokan bilibili_tw
echo ">>> gamer"
call npm run bdh hokan gamer


@REM call npm run bdh update 202304