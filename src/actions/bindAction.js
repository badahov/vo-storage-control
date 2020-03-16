import { bindActionCreators } from 'redux';
import actions from './index';

export default function bindAction(modelName, service, dispatch) {
  const worker = actions(modelName, service);
  return bindActionCreators({ worker }, dispatch).worker;
}

