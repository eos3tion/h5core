module junyou {
    export const enum SoundDomain {
        All = 0
    }

    export interface SoundOption {
        startTime: number;
        /**
         * 调用play的时间戳
         * 
         * @type {number}
         * @memberOf SoundOption
         */
        playStart: number;
        loop: number;
        timeout: number;
    }

    export const SoundManager = (function () {
        /**
         * 正在播放中的声音
         */
        let playings = {} as { [index: number]: SoundChannel };
        let soundsDict = {} as { [index: string]: Sound };
        let guid = 1;
        return {
            play,
            preload,
            stopSound,
            stopSounds,
            volume
        }
        /**
         * 根据id调整音量
         * 
         * @param {number} volume 
         * @param {number} id 
         */
        function volume(volume: number, id: number) {
            let sound = playings[id];
            if (sound) {
                let ch = sound.channel;
                if (ch) {
                    ch.volume = volume;
                } else {
                    pushChAction(sound, arguments);
                }
            }
        }

        function pushChAction(ch: SoundChannel, arg: IArguments) {
            let actions = ch.actions;
            if (!actions) {
                ch.actions = actions = [];
            }
            let arr = [];
            for (let i = 0; i < arg.length; i++) {
                arr[i] = arg[i];
            }
            actions.push([arg.callee, arr]);
        }

        /**
         * 停止整个domain的声音
         * 
         * @param {number} domain 
         * @param {boolean} [useTween] 
         */
        function stopSounds(domain: number, useTween?: boolean) {
            filterPlaying(ch => _stopFilter(ch, ch => ch.domain == domain, useTween));
        }

        /**
         * 停止某个声音
         * 
         * @param {number} id 
         * @param {boolean} [useTween] 
         */
        function stopSound(id: number, useTween?: boolean) {
            filterPlaying(ch => _stopFilter(ch, ch => ch.id == id, useTween), true);
        }

        function _stopFilter(ch: SoundChannel, filter: { (ch: SoundChannel): boolean }, useTween?: boolean) {
            let channel = ch.channel;
            let flag = filter(ch);
            if (flag) {
                if (useTween) {
                    Global.getTween(channel).to({ volume: 0 }).call(channel.stop);
                } else {
                    channel.stop();
                }
            }
            return !flag;
        }

        /**
         * 预加载某个音频，后续改成使用res加载，得到base64的数据
         * 
         * @param {string} url 
         */
        function preload(url: string) {
            getSound(url);
        }

        /**
         * 播放一个声音
         * 
         * @param {string} url 声音地址
         * @param {SoundDomain} [domain] 声音加入的域
         * @param {number} [loop] 循环次数，默认播放1次，0则表示无限循环播放
         * @param {number} [startTime] 开始时间，默认从起点开始
         * @returns 如果可以播放声音，则返回声音通道的唯一id
         */
        function play(url: string, domain?: SoundDomain, loop = 1, timeout = 500, startTime?: number) {
            //后续使用localRes处理
            let sound = getSound(url);
            let state = sound.state;
            if (state == RequestState.FAILED) {
                return 0;
            }
            let id = guid++;
            domain = ~~domain;
            let ch = { id, url, domain } as SoundChannel;
            playings[id] = ch;
            if (state == RequestState.COMPLETE) {
                startChannel(sound, ch, startTime, loop);
            } else {
                ch.option = { startTime, playStart: Global.now, timeout, loop };
                let promises = sound.promises;
                if (!promises) {
                    sound.promises = promises = [];
                }
                promises.push(id);
            }
            return id;
        }

        function startChannel(sound: Sound, ch: SoundChannel, startTime: number, loop: number) {
            let channel = sound.sound.play(startTime, loop);
            channel.once(egret.Event.COMPLETE, onComplete, undefined);
            ch.channel = channel;
            let actions = ch.actions;
            if (actions) {
                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    action[0].apply(null, action[1]);
                }
                delete ch.actions;
            }
        }

        function onComplete(e: egret.Event) {
            let channel = e.currentTarget;
            filterPlaying(ch => ch.channel != channel);
        }

        function getSound(url: string) {
            let sound = soundsDict[url];
            if (!sound) {
                soundsDict[url] = sound = { url, sound: undefined, state: RequestState.REQUESTING };
                RES.getResByUrl(url, (eSound: egret.Sound) => {
                    if (eSound) {
                        sound.sound = eSound;
                        sound.state = RequestState.COMPLETE;
                        let promises = sound.promises;
                        if (promises) {
                            delete sound.promises;
                            //检查所有启动的声音，是否已经达到超时时间
                            let now = Global.now;
                            for (let i = 0, len = promises.length; i < len; i++) {
                                let id = promises[i];
                                let ch = playings[id];
                                if (ch) {//没有id的说明已经被移除
                                    let option = ch.option;
                                    if (option) {
                                        delete ch.option;
                                        let delta = now - option.playStart;
                                        if (delta < option.timeout) {
                                            let startTime = option.startTime + delta;
                                            startChannel(sound, ch, startTime, option.loop);
                                        } else {
                                            delete playings[id];
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        delete sound.promises;
                        sound.state = RequestState.FAILED;
                        //销毁所有相同url，正在播放的channel
                        filterPlaying(channel => channel.url != url);
                    }
                }, null, "sound");
                // let eSound = new egret.Sound();
                // soundsDict[url] = sound = { url, sound: eSound, state: RequestState.REQUESTING };
                // eSound.load(url);
                // (eSound as egret.EventDispatcher).on(egret.Event.COMPLETE, soundComplete);
                // (eSound as egret.EventDispatcher).on(egret.IOErrorEvent.IO_ERROR, soundError);
            }
            return sound;
        }

        // function soundComplete(e: egret.Event) {
        //     let eSound = e.currentTarget;
        //     let sound = soundsDict[eSound.url];
        //     if (sound) {
        //         sound.state = RequestState.COMPLETE;
        //         let promises = sound.promises;
        //         if (promises) {
        //             sound.promises = undefined;
        //             //检查所有启动的声音，是否已经达到超时时间
        //             let now = Global.now;
        //             for (let i = 0, len = promises.length; i < len; i++) {
        //                 let id = promises[i];
        //                 let ch = playings[id];
        //                 if (ch) {//没有id的说明已经被移除
        //                     let option = ch.option;
        //                     if (option) {
        //                         ch.option = undefined;
        //                         let delta = now - option.playStart;
        //                         if (delta < option.timeout) {
        //                             let startTime = option.startTime + delta;
        //                             startChannel(sound, ch, startTime, option.loop);
        //                         } else {
        //                             delete playings[id];
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        // function soundError(e: egret.Event) {
        //     let eSound = e.currentTarget;
        //     let url = eSound.url;
        //     let sound = soundsDict[url];
        //     if (sound) {
        //         //销毁所有相同url，正在播放的channel
        //         filterPlaying(channel => channel.url != url);
        //     }
        // }

        function filterPlaying(filter: { (channel: SoundChannel): boolean }, doBreak?: boolean) {
            for (let id in playings) {
                let channel = playings[id];
                if (!filter(channel)) {
                    delete playings[id];
                    if (doBreak) {
                        break;
                    }
                }
            }
        }
    })();

    export interface Sound {
        url: string;
        state: RequestState;
        sound: egret.Sound;
        promises?: number[];
    }

    export interface SoundChannel {
        id: number;
        /**
         * 如果当前Sound未加载完毕，则此时间为声音播放的过期时间
         * 
         * @type {number}
         * @memberOf SoundChannel
         */
        option?: SoundOption;
        url: string;
        channel?: egret.SoundChannel;
        domain: number;
        actions?: [Function, any[]][];
    }
}