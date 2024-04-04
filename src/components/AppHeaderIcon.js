import React from "react";
import { Platform } from 'react-native';
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from '@expo/vector-icons';
import { THEME } from "../theme";

export const AppHeaderIcon = (props) => <HeaderButton {...props} IconComponent={Ionicons} iconSize={24} color={Platform.OS === 'android' ? 'white' : THEME.MAIN_COLOR} />