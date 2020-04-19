import { bindActionCreators } from 'redux';
import actions from './action';

export default function bindAction(
  modelName:string,
  service: (action: string, data: object | null) => Promise<any> | object,
  dispatch : () => any,
) {
  const worker = actions(modelName, service);
  return bindActionCreators({ worker }, dispatch).worker;
}
