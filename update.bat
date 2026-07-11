@REM 需要注意續集同ID: abema, netflix, disneyplus, bilibili, muse_hk, ani_one, ani_one_asia, crunchyroll
@REM git apply --reject --whitespace=fix ../bangumi-data/helper.patch

@REM echo ">>> nicovideo"
@REM call npx bdh hokan nicovideo
@REM echo ">>> unext"
@REM call npx bdh hokan unext
@REM echo ">>> abema"
@REM call npx bdh hokan abema
@REM echo ">>> danime"
@REM call npx bdh hokan danime
@REM echo ">>> prime"
@REM call npx bdh hokan prime
@REM echo ">>> netflix"
@REM call npx bdh hokan netflix
@REM echo ">>> disneyplus"
@REM call npx bdh hokan disneyplus
@REM echo ">>> crunchyroll"
@REM call npx bdh hokan crunchyroll

@REM echo ">>> muse_hk"
@REM call npx bdh hokan muse_hk
@REM echo ">>> ani_one"
@REM call npx bdh hokan ani_one
@REM echo ">>> ani_one_asia"
@REM call npx bdh hokan ani_one_asia
@REM echo ">>> tropics"
@REM call npx bdh hokan tropics
@REM echo ">>> mighty"
@REM call npx bdh hokan mighty
@REM echo ">>> viu"
@REM call npx bdh hokan viu
@REM echo ">>> gamer_hk"
@REM call npx bdh hokan gamer_hk
@REM echo ">>> mytv"
@REM call npx bdh hokan mytv
@REM echo ">>> bilibili_hk_mo_tw"
@REM call npx bdh hokan bilibili_hk_mo_tw
@REM echo ">>> bilibili_hk_mo"
@REM call npx bdh hokan bilibili_hk_mo

@REM echo ">>> bilibili"
@REM call npx bdh hokan bilibili

@REM echo ">>> bilibili_tw"
@REM call npx bdh hokan bilibili_tw
@REM echo ">>> gamer"
@REM call npx bdh hokan gamer
@REM echo ">>> muse_tw"
@REM call npx bdh hokan muse_tw

@REM echo ">>> dmhy"
@REM call npx bdh hokan dmhy
@REM echo ">>> mikan"
@REM call npx bdh hokan mikan
@REM echo ">>> bangumi_moe"
@REM call npx bdh hokan bangumi_moe

@REM echo ">>> mal"
@REM call npx bdh hokan mal
@REM echo ">>> aniList"
@REM call npx bdh hokan aniList
@REM echo ">>> anidb"
@REM call npx bdh hokan anidb
@REM echo ">>> tmdb"
@REM call npx bdh hokan tmdb


@REM echo ">>> nicovideo"
@REM call npx bdh cleanup nicovideo
@REM echo ">>> abema"
@REM call npx bdh cleanup abema
@REM echo ">>> unext"
@REM call npx bdh cleanup unext
@REM echo ">>> danime"
@REM call npx bdh cleanup danime
@REM echo ">>> prime"
@REM call npx bdh cleanup prime
@REM echo ">>> netflix"
@REM call npx bdh cleanup netflix
@REM echo ">>> disneyplus"
@REM call npx bdh cleanup disneyplus
@REM echo ">>> crunchyroll"
@REM call npx bdh cleanup crunchyroll

@REM echo ">>> muse_hk"
@REM call npx bdh cleanup muse_hk
@REM echo ">>> ani_one"
@REM call npx bdh cleanup ani_one
@REM echo ">>> ani_one_asia"
@REM call npx bdh cleanup ani_one_asia
@REM echo ">>> tropics"
@REM call npx bdh cleanup tropics
@REM echo ">>> viu"
@REM call npx bdh cleanup viu
@REM echo ">>> gamer_hk"
@REM call npx bdh cleanup gamer_hk
@REM echo ">>> mytv"
@REM call npx bdh cleanup mytv
@REM echo ">>> bilibili_hk_mo_tw"
@REM call npx bdh cleanup bilibili_hk_mo_tw
@REM echo ">>> bilibili_hk_mo"
@REM call npx bdh cleanup bilibili_hk_mo

@REM echo ">>> bilibili"
@REM call npx bdh cleanup bilibili

@REM echo ">>> bilibili_tw"
@REM call npx bdh cleanup bilibili_tw
@REM echo ">>> gamer"
@REM call npx bdh cleanup gamer
@REM echo ">>> muse_tw"
@REM call npx bdh cleanup muse_tw

@REM echo ">>> youtubeBeforeDefault"
@REM call npx bdh validate youtubeBeforeDefault
@REM echo ">>> urlPunycode"
@REM call npx bdh validate urlPunycode
@REM echo ">>> tmdb"
@REM call npx bdh validate tmdb
@REM echo ">>> tmdbBegin"
@REM call npx bdh validate tmdbBegin


@REM call npx bdh update 202607
