import { getData } from 'utils/helpers';

export const getPlatform = (param) => getData('/adlibAPI', param);

export const getPlatformViaId = (id) => getData('/adlibAPI/getPlatform', id);
