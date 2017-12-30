import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'page-menu ion-menu scroll-content': {
    'overflow': 'hidden'
  },
  'page-menu #custom-overlay': {
    'backgroundSize': 'cover',
    'position': 'fixed',
    'top': [{ 'unit': 'px', 'value': 0 }],
    'right': [{ 'unit': 'px', 'value': 0 }],
    'bottom': [{ 'unit': 'px', 'value': 0 }],
    'left': [{ 'unit': 'px', 'value': 0 }],
    'zIndex': '1000000',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'backgroundColor': 'transparent'
  },
  'page-menu ion-menu buttonitemitem-block': {
    'height': [{ 'unit': 'rem', 'value': 8 }]
  },
  'page-menu ion-avatar img': {
    'display': 'block',
    'marginTop': [{ 'unit': 'px', 'value': 12 }, { 'unit': 'string', 'value': '!important' }],
    'marginBottom': [{ 'unit': 'px', 'value': 12 }, { 'unit': 'string', 'value': '!important' }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'borderRadius': '50%',
    'width': [{ 'unit': 'px', 'value': 120 }],
    'padding': [{ 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }, { 'unit': 'px', 'value': 5 }]
  }
});
