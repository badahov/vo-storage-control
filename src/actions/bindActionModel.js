import { bindActionCreators } from 'redux';
import actions from './actionModel';

export default function bindActionModel(moduleName, modelName, service, dispatch) {
  const worker = actions(moduleName, modelName, service);
  return bindActionCreators({ worker }, dispatch).worker;
}

