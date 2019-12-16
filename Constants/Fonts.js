import {Platform} from 'react-native';

const Fonts = {
    NORMAL: Platform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto',
    LIGHT: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto',
    MEDIUM: Platform.OS === 'ios' ? 'HelveticaNeue-Medium' : 'Roboto',
    BOLD: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'Roboto'
};

export default Fonts;