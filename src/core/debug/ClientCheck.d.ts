/**
 * 是否不做客户端检查  
 * 客户端检查的部分，后续统一按下面例子处理  
 * @example 
 *  if (!noClientCheck) {
 *       if (!$hero.clan) {
 *          return CoreFunction.showClientTips(MsgCodeConst.Code_883);
 *      }
 *  }
 */
declare var noClientCheck: boolean;