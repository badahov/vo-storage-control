"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=bindActionModel;var _redux=require("redux"),_actionModel=_interopRequireDefault(require("./actionModel"));function bindActionModel(e,r,t,i){var o=(0,_actionModel.default)(e,r,t);return(0,_redux.bindActionCreators)({worker:o},i).worker}