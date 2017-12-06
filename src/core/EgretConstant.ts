// 白鹭的字符串常量集
const enum EgretEvent {

    /**************************************** egret.Event ****************************************/

    /**
 * Dispatched when a display object is added to the on stage display list, either directly or through the addition
 * of a sub tree in which the display object is contained.
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
    /**
     * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ADDED_TO_STAGE = "addedToStage",
    /**
     * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
     * of a sub tree in which the display object is contained.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    REMOVED_FROM_STAGE = "removedFromStage",
    /**
     * Dispatched when a display object is added to the display list.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将显示对象添加到显示列表中时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ADDED = "added",
    /**
     * Dispatched when a display object is about to be removed from the display list.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将要从显示列表中删除显示对象时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    REMOVED = "removed",
    /**
     * [broadcast event] Dispatched when the playhead is entering a new frame.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ENTER_FRAME = "enterFrame",
    /**
     * Dispatched when the display list is about to be updated and rendered.
     * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 渲染事件，监听此事件将会在本帧末即将开始渲染的前一刻触发回调，这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
     * 注意：每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 stage.invalidate() 方法，由于每帧只会触发一次屏幕刷新，
     * 若在 Event.RENDER 回调函数执行期间再次调用stage.invalidate()，将会被忽略。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    RENDER = "render",
    /**
     * Dispatched when the size of stage or UIComponent is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 舞台尺寸或UI组件尺寸发生改变
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    RESIZE = "resize",

    /**
     * Dispatched when the value or selection of a property is chaned.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 属性值或状态发生改变。通常是按钮的选中状态，或者列表的选中项索引改变。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CHANGE = "change",

    /**
     * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
     * preventDefault() method.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 属性值或状态即将发生改变,通常是按钮的选中状态，或者列表的选中项索引改变。可以通过调用 preventDefault() 方法阻止索引发生更改。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CHANGING = "changing",
    /**
     * Dispatched when the net request is complete.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 网络请求加载完成
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    COMPLETE = "complete",

    /**
     * Dispatched when loop completed.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 循环完成。循环最后一次只派发 COMPLETE 事件，不派发 LOOP_COMPLETE 事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    LOOP_COMPLETE = "loopComplete",

    /**
     * Dispatched when the TextInput instance gets focus.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TextInput实例获得焦点
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    FOCUS_IN = "focusIn",
    /**
     * Dispatched when the TextInput instance loses focus.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TextInput实例失去焦点
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    FOCUS_OUT = "focusOut",
    /**
     * Dispatched when the playback is ended.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 动画声音等播放完成
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ENDED = "ended",


    /**
     * 游戏激活
     * @version Egret 2.4
     * @platform Web,Native
     */
    ACTIVATE = "activate",

    /**
     * 取消激活
     * @version Egret 2.4
     * @platform Web,Native
     */
    DEACTIVATE = "deactivate",

    /**
     * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    CLOSE = "close",

    /**
     * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    CONNECT = "connect",


    /**
     * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    LEAVE_STAGE = "leaveStage",

    /**
     * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
     * @version Egret 2.4
     * @platform Web,Native
     */
    SOUND_COMPLETE = "soundComplete",


    /**************************************** egret.StageOrientationEvent ****************************************/

    /**
     * After screen rotation distribute events.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 屏幕旋转后派发的事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ORIENTATION_CHANGE = "orientationChange",

    /**************************************** egret.TextEvent ****************************************/
    /**
     * It defines the value of the type property of a link event object.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 定义 link 事件对象的 type 属性值。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    LINK = "link",

    /**************************************** egret.TouchEvent ****************************************/
    /**
    * Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
    * @version Egret 2.4
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_MOVE = "touchMove",

    /**
     * Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_BEGIN = "touchBegin",

    /**
     * Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
     * or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_END = "touchEnd",
    /**
     * Dispatched when an event of some kind occurred that canceled the touch.
     * Such as the eui.Scroller will dispatch 'TOUCH_CANCEL' when it start move, the 'TOUCH_END' and 'TOUCH_TAP' will not be triggered.
     * @version Egret 3.0.1
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 由于某个事件取消了触摸时触发。比如 eui.Scroller 在开始滚动后会触发 'TOUCH_CANCEL' 事件，不再触发后续的 'TOUCH_END' 和 'TOUCH_TAP' 事件
     * @version Egret 3.0.1
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_CANCEL = "touchCancel",

    /**
     * Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact
     * was initiated on a touch-enabled device.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户在触摸设备上与开始触摸的同一 DisplayObject 实例上抬起接触点时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_TAP = "touchTap",
    /**
     * Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact
     * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
     * object on a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当用户在触摸设备上与开始触摸的不同 DisplayObject 实例上抬起接触点时调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    TOUCH_RELEASE_OUTSIDE = "touchReleaseOutside",

    /**************************************** RES.ResourceEvent ****************************************/

    /**
 * Failure event for a load item.
 * @version Egret 2.4
 * @platform Web,Native
 * @language en_US
 */
    /**
     * 一个加载项加载失败事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    ITEM_LOAD_ERROR = "itemLoadError",
    /**
     * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CONFIG_COMPLETE = "configComplete",
    /**
     * Configuration file failed to load.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 配置文件加载失败事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    CONFIG_LOAD_ERROR = "configLoadError",
    /**
     * Delay load group resource loading progress event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 延迟加载组资源加载进度事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    GROUP_PROGRESS = "groupProgress",
    /**
     * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    GROUP_COMPLETE = "groupComplete",
    /**
     * Delayed load group resource failed event.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 延迟加载组资源加载失败事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    GROUP_LOAD_ERROR = "groupLoadError",

    /**************************************** Egret.IOErrorEvent ****************************************/
    /**
     * io error
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * io发生错误
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    IO_ERROR = "ioError",
}