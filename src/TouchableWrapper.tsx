import * as React from 'react';
import { Platform, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';


interface TouchableWrapperProps {
  children: any,
  onPress?: (event: GestureResponderEvent) => void,
  style?: StyleProp<ViewStyle>
}

export default function TouchableWrapper({ children, onPress, style }: TouchableWrapperProps) {
  // so I noticed TouchableWithoutFeedback works better on ios
  // while TouchableOpacity works better on android
  return Platform.OS == "ios" ? (
    <TouchableWithoutFeedback style={style} onPress={onPress}>
      {children}
    </TouchableWithoutFeedback>
  ) : (
      <TouchableOpacity style={style} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
}