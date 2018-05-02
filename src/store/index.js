import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

import * as types from './mutation-types'

export default new Vuex.Store({
 state,
 actions,
 getters,
 mutations:{
	[types.SET_PLAY_STATE] (state, val){
		state.playState = val;
	},
	[types.SET_CUR_SONG] (state, val){
		state.curSong = val;
	},
	[types.SET_CUR_SONG_SRC] (state, src){
		state.curSongSrc = src;
	},
	[types.SET_CUR_SINGER] (state, val){
		state.curSinger = val;
	},
	[types.SET_CUR_SONG_INDEX] (state, index){
		state.curSongIndex = index;
	},
	[types.SET_SONG_LIST] (state, val){
		//防止添加重复歌曲
		let num = 0;
		state.songList.map(function(s,k){
			if(s.songid != val.songid){
				num++;
			}
		});
		if(num >= state.songList.length){
			state.songList.push(val);
		}
		
	}
 },
 strict: debug,
 plugins: debug ? [createLogger()] : []
})