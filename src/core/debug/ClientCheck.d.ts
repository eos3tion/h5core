declare namespace jy {
    /**
     * 是否不做客户端检查  
     * 客户端检查的部分，后续统一按下面例子处理  
     * @example 
     *  if ((RELEASE ||  !jy.noClientCheck)) {
     *       if (!$hero.clan) {
     *          return CoreFunction.showClientTips(MsgCodeConst.Code_883);
     *      }
     *  }
     */
	var noClientCheck: boolean;
}
